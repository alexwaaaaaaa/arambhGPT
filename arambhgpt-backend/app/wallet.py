from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import uuid
from typing import List, Optional
from pydantic import BaseModel
import sqlite3

from .database import get_db_connection
from .payment_gateway import payment_gateway

# Database initialization
def init_wallet_tables():
    """Initialize wallet-related tables"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Wallet balances table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS wallet_balances (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE,
                balance REAL DEFAULT 0.0,
                currency TEXT DEFAULT 'INR',
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Transactions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                amount REAL NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                consultation_type TEXT,
                professional_id TEXT,
                professional_name TEXT,
                session_id TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'completed',
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Consultation sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS consultation_sessions (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                professional_id TEXT NOT NULL,
                type TEXT NOT NULL,
                start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                end_time TIMESTAMP,
                rate REAL NOT NULL,
                total_cost REAL DEFAULT 0.0,
                status TEXT DEFAULT 'active',
                duration_minutes INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Professional rates table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS professional_rates (
                id TEXT PRIMARY KEY,
                professional_id TEXT NOT NULL UNIQUE,
                chat_rate REAL DEFAULT 5.0,
                voice_rate REAL DEFAULT 8.0,
                video_rate REAL DEFAULT 12.0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Professional profiles table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS professional_profiles (
                id TEXT PRIMARY KEY,
                professional_id TEXT NOT NULL UNIQUE,
                bio TEXT,
                specialization TEXT,
                education TEXT,
                certifications TEXT,
                languages TEXT,
                location_city TEXT,
                location_country TEXT,
                phone TEXT,
                website TEXT,
                linkedin TEXT,
                twitter TEXT,
                availability TEXT DEFAULT 'online',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Professional wallet balances table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS professional_wallet_balances (
                id TEXT PRIMARY KEY,
                professional_id TEXT NOT NULL UNIQUE,
                balance REAL DEFAULT 0.0,
                total_earned REAL DEFAULT 0.0,
                total_withdrawn REAL DEFAULT 0.0,
                currency TEXT DEFAULT 'INR',
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Professional withdrawal requests table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS professional_withdrawals (
                id TEXT PRIMARY KEY,
                professional_id TEXT NOT NULL,
                amount REAL NOT NULL,
                bank_account TEXT NOT NULL,
                ifsc_code TEXT NOT NULL,
                account_holder TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                processed_at TIMESTAMP,
                transaction_id TEXT,
                notes TEXT
            )
        ''')
        
        # Platform commission table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS platform_commissions (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                professional_id TEXT NOT NULL,
                gross_amount REAL NOT NULL,
                commission_rate REAL DEFAULT 0.30,
                commission_amount REAL NOT NULL,
                net_amount REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ Wallet tables initialized successfully!")
        
    except Exception as e:
        print(f"❌ Wallet tables initialization error: {e}")

# Initialize wallet tables
init_wallet_tables()

# Pydantic Models
class WalletBalanceResponse(BaseModel):
    id: str
    userId: str
    balance: float
    currency: str
    lastUpdated: str

class TransactionResponse(BaseModel):
    id: str
    userId: str
    type: str
    amount: float
    description: str
    category: str
    consultationType: Optional[str]
    professionalId: Optional[str]
    professionalName: Optional[str]
    sessionId: Optional[str]
    timestamp: str
    status: str

class RechargeRequest(BaseModel):
    userId: str
    amount: float
    paymentMethod: str

class PaymentVerificationRequest(BaseModel):
    userId: str
    orderId: str
    paymentId: str
    signature: str
    paymentMethod: str

class StartSessionRequest(BaseModel):
    userId: str
    professionalId: str
    type: str
    rate: float

class EndSessionRequest(BaseModel):
    sessionId: str

class WithdrawRequest(BaseModel):
    amount: float
    bank_account: str
    ifsc_code: str
    account_holder: str

class ProfessionalBalanceResponse(BaseModel):
    id: str
    professionalId: str
    balance: float
    totalEarned: float
    totalWithdrawn: float
    currency: str
    lastUpdated: str

class ActiveSessionResponse(BaseModel):
    id: str
    userId: str
    professionalId: str
    type: str
    startTime: str
    rate: float
    totalCost: float
    status: str

router = APIRouter(prefix="/api/wallet", tags=["wallet"])

@router.get("/balance")
async def get_wallet_balance(userId: str):
    """Get user's wallet balance"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get existing balance
        cursor.execute("SELECT * FROM wallet_balances WHERE user_id = ?", (userId,))
        balance = cursor.fetchone()
        
        if not balance:
            # Create new wallet for user
            wallet_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO wallet_balances (id, user_id, balance, currency, last_updated)
                VALUES (?, ?, 0.0, 'INR', ?)
            """, (wallet_id, userId, datetime.utcnow().isoformat()))
            conn.commit()
            
            # Fetch the newly created balance
            cursor.execute("SELECT * FROM wallet_balances WHERE user_id = ?", (userId,))
            balance = cursor.fetchone()
        
        conn.close()
        
        return WalletBalanceResponse(
            id=balance['id'],
            userId=str(balance['user_id']),
            balance=balance['balance'],
            currency=balance['currency'],
            lastUpdated=balance['last_updated']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching balance: {str(e)}")

@router.post("/recharge")
async def recharge_wallet(request: RechargeRequest):
    """Add money to user's wallet"""
    try:
        if request.amount < 10:
            raise HTTPException(status_code=400, detail="Minimum recharge amount is ₹10")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get or create wallet
        cursor.execute("SELECT * FROM wallet_balances WHERE user_id = ?", (request.userId,))
        balance = cursor.fetchone()
        
        if not balance:
            wallet_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO wallet_balances (id, user_id, balance, currency, last_updated)
                VALUES (?, ?, 0.0, 'INR', ?)
            """, (wallet_id, request.userId, datetime.utcnow().isoformat()))
            current_balance = 0.0
        else:
            current_balance = balance['balance']
        
        # Calculate bonus
        bonus = 0
        if request.amount >= 5000: bonus = 1500
        elif request.amount >= 2000: bonus = 500
        elif request.amount >= 1000: bonus = 200
        elif request.amount >= 500: bonus = 75
        elif request.amount >= 250: bonus = 25
        
        total_credit = request.amount + bonus
        new_balance = current_balance + total_credit
        
        # Update balance
        cursor.execute("""
            UPDATE wallet_balances 
            SET balance = ?, last_updated = ?
            WHERE user_id = ?
        """, (new_balance, datetime.utcnow().isoformat(), request.userId))
        
        # Create payment order
        payment_order = payment_gateway.create_payment_order(
            amount=request.amount,
            payment_method=request.paymentMethod,
            user_id=request.userId
        )
        
        if not payment_order["success"]:
            raise HTTPException(status_code=500, detail="Payment order creation failed")
        
        # Create pending transaction record
        transaction_id = str(uuid.uuid4())
        description = f"Wallet recharge via {request.paymentMethod}"
        if bonus > 0:
            description += f" (₹{bonus} bonus)"
            
        cursor.execute("""
            INSERT INTO transactions (id, user_id, type, amount, description, category, timestamp, status)
            VALUES (?, ?, 'credit', ?, ?, 'recharge', ?, 'pending')
        """, (transaction_id, request.userId, total_credit, description, datetime.utcnow().isoformat()))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "Payment order created successfully",
            "amount": request.amount,
            "bonus": bonus,
            "totalCredit": total_credit,
            "paymentOrder": payment_order,
            "transactionId": transaction_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recharge failed: {str(e)}")

@router.get("/transactions")
async def get_transactions(userId: str):
    """Get user's transaction history"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM transactions 
            WHERE user_id = ? 
            ORDER BY timestamp DESC
        """, (userId,))
        
        transactions = cursor.fetchall()
        conn.close()
        
        return [
            TransactionResponse(
                id=t['id'],
                userId=str(t['user_id']),
                type=t['type'],
                amount=t['amount'],
                description=t['description'],
                category=t['category'],
                consultationType=t['consultation_type'],
                professionalId=t['professional_id'],
                professionalName=t['professional_name'],
                sessionId=t['session_id'],
                timestamp=t['timestamp'],
                status=t['status']
            ) for t in transactions
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching transactions: {str(e)}")

@router.post("/start-session")
async def start_consultation_session(request: StartSessionRequest):
    """Start a consultation session"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user has sufficient balance
        cursor.execute("SELECT balance FROM wallet_balances WHERE user_id = ?", (request.userId,))
        balance_row = cursor.fetchone()
        
        if not balance_row or balance_row['balance'] < request.rate:
            conn.close()
            raise HTTPException(status_code=400, detail="Insufficient wallet balance")
        
        # Check if user already has an active session
        cursor.execute("""
            SELECT id FROM consultation_sessions 
            WHERE user_id = ? AND status = 'active'
        """, (request.userId,))
        
        active_session = cursor.fetchone()
        if active_session:
            conn.close()
            raise HTTPException(status_code=400, detail="You already have an active session")
        
        # Create new session
        session_id = str(uuid.uuid4())
        start_time = datetime.utcnow().isoformat()
        
        cursor.execute("""
            INSERT INTO consultation_sessions 
            (id, user_id, professional_id, type, start_time, rate, total_cost, status, duration_minutes)
            VALUES (?, ?, ?, ?, ?, ?, 0.0, 'active', 0)
        """, (session_id, request.userId, request.professionalId, request.type, start_time, request.rate))
        
        conn.commit()
        conn.close()
        
        return ActiveSessionResponse(
            id=session_id,
            userId=request.userId,
            professionalId=request.professionalId,
            type=request.type,
            startTime=start_time,
            rate=request.rate,
            totalCost=0.0,
            status="active"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start session: {str(e)}")

@router.post("/end-session")
async def end_consultation_session(request: EndSessionRequest):
    """End a consultation session and charge the user"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get session
        cursor.execute("""
            SELECT * FROM consultation_sessions 
            WHERE id = ? AND status = 'active'
        """, (request.sessionId,))
        
        session = cursor.fetchone()
        if not session:
            conn.close()
            raise HTTPException(status_code=404, detail="Active session not found")
        
        # Calculate duration and cost
        end_time = datetime.utcnow()
        start_time = datetime.fromisoformat(session['start_time'])
        duration = (end_time - start_time).total_seconds() / 60  # minutes
        duration_minutes = max(1, int(duration))  # Minimum 1 minute billing
        total_cost = duration_minutes * session['rate']
        
        # Get user's wallet
        cursor.execute("SELECT balance FROM wallet_balances WHERE user_id = ?", (session['user_id'],))
        balance_row = cursor.fetchone()
        
        if not balance_row:
            conn.close()
            raise HTTPException(status_code=400, detail="Wallet not found")
        
        current_balance = balance_row['balance']
        
        # Check if user has sufficient balance
        if current_balance < total_cost:
            total_cost = current_balance  # Charge whatever is available
        
        new_balance = current_balance - total_cost
        
        # Update session
        cursor.execute("""
            UPDATE consultation_sessions 
            SET end_time = ?, total_cost = ?, duration_minutes = ?, status = 'ended'
            WHERE id = ?
        """, (end_time.isoformat(), total_cost, duration_minutes, request.sessionId))
        
        # Deduct from wallet
        cursor.execute("""
            UPDATE wallet_balances 
            SET balance = ?, last_updated = ?
            WHERE user_id = ?
        """, (new_balance, datetime.utcnow().isoformat(), session['user_id']))
        
        # Create transaction record for user
        consultation_type_label = {
            'chat': 'Text Chat',
            'voice': 'Voice Call',
            'video': 'Video Call'
        }.get(session['type'], 'Consultation')
        
        transaction_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO transactions 
            (id, user_id, type, amount, description, category, consultation_type, 
             professional_id, professional_name, session_id, timestamp, status)
            VALUES (?, ?, 'debit', ?, ?, 'consultation', ?, ?, ?, ?, ?, 'completed')
        """, (
            transaction_id, session['user_id'], total_cost,
            f"{consultation_type_label} consultation ({duration_minutes} min)",
            session['type'], session['professional_id'],
            f"Professional {session['professional_id']}", request.sessionId,
            datetime.utcnow().isoformat()
        ))
        
        # Calculate professional earnings (70% after 30% commission)
        commission_rate = 0.30
        commission_amount = total_cost * commission_rate
        net_professional_earning = total_cost - commission_amount
        
        # Record platform commission
        commission_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO platform_commissions 
            (id, session_id, professional_id, gross_amount, commission_rate, commission_amount, net_amount, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            commission_id, request.sessionId, session['professional_id'],
            total_cost, commission_rate, commission_amount, net_professional_earning,
            datetime.utcnow().isoformat()
        ))
        
        # Update professional wallet
        cursor.execute("""
            SELECT * FROM professional_wallet_balances WHERE professional_id = ?
        """, (session['professional_id'],))
        
        prof_wallet = cursor.fetchone()
        if prof_wallet:
            new_prof_balance = prof_wallet['balance'] + net_professional_earning
            new_total_earned = prof_wallet['total_earned'] + net_professional_earning
            cursor.execute("""
                UPDATE professional_wallet_balances 
                SET balance = ?, total_earned = ?, last_updated = ?
                WHERE professional_id = ?
            """, (new_prof_balance, new_total_earned, datetime.utcnow().isoformat(), session['professional_id']))
        else:
            # Create new professional wallet
            prof_wallet_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO professional_wallet_balances 
                (id, professional_id, balance, total_earned, total_withdrawn, currency, last_updated)
                VALUES (?, ?, ?, ?, 0.0, 'INR', ?)
            """, (prof_wallet_id, session['professional_id'], net_professional_earning, 
                  net_professional_earning, datetime.utcnow().isoformat()))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "sessionId": request.sessionId,
            "duration": duration_minutes,
            "totalCost": total_cost,
            "remainingBalance": new_balance,
            "message": f"Session ended. Charged ₹{total_cost:.2f} for {duration_minutes} minutes"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to end session: {str(e)}")

@router.get("/active-session")
async def get_active_session(userId: str):
    """Get user's active consultation session"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM consultation_sessions 
            WHERE user_id = ? AND status = 'active'
        """, (userId,))
        
        session = cursor.fetchone()
        conn.close()
        
        if not session:
            return None
        
        # Calculate current cost
        current_time = datetime.utcnow()
        start_time = datetime.fromisoformat(session['start_time'])
        duration = (current_time - start_time).total_seconds() / 60
        duration_minutes = max(1, int(duration))
        current_cost = duration_minutes * session['rate']
        
        return ActiveSessionResponse(
            id=session['id'],
            userId=str(session['user_id']),
            professionalId=session['professional_id'],
            type=session['type'],
            startTime=session['start_time'],
            rate=session['rate'],
            totalCost=current_cost,
            status=session['status']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching active session: {str(e)}")

@router.post("/verify-payment")
async def verify_payment(request: PaymentVerificationRequest):
    """Verify payment and complete wallet recharge"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verify payment with gateway
        payment_data = {
            "order_id": request.orderId,
            "payment_id": request.paymentId,
            "signature": request.signature,
            "payment_method": request.paymentMethod
        }
        
        verification_result = payment_gateway.verify_payment(payment_data)
        
        if not verification_result["verified"]:
            # Update transaction status to failed
            cursor.execute("""
                UPDATE transactions 
                SET status = 'failed'
                WHERE user_id = ? AND status = 'pending'
                ORDER BY timestamp DESC LIMIT 1
            """, (request.userId,))
            conn.commit()
            conn.close()
            
            raise HTTPException(status_code=400, detail="Payment verification failed")
        
        # Get pending transaction
        cursor.execute("""
            SELECT * FROM transactions 
            WHERE user_id = ? AND status = 'pending'
            ORDER BY timestamp DESC LIMIT 1
        """, (request.userId,))
        
        transaction = cursor.fetchone()
        if not transaction:
            conn.close()
            raise HTTPException(status_code=404, detail="Pending transaction not found")
        
        # Update wallet balance
        cursor.execute("SELECT balance FROM wallet_balances WHERE user_id = ?", (request.userId,))
        balance_row = cursor.fetchone()
        
        if balance_row:
            new_balance = balance_row['balance'] + transaction['amount']
            cursor.execute("""
                UPDATE wallet_balances 
                SET balance = ?, last_updated = ?
                WHERE user_id = ?
            """, (new_balance, datetime.utcnow().isoformat(), request.userId))
        else:
            new_balance = transaction['amount']
            wallet_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO wallet_balances (id, user_id, balance, currency, last_updated)
                VALUES (?, ?, ?, 'INR', ?)
            """, (wallet_id, request.userId, new_balance, datetime.utcnow().isoformat()))
        
        # Update transaction status
        cursor.execute("""
            UPDATE transactions 
            SET status = 'completed'
            WHERE id = ?
        """, (transaction['id'],))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "Payment verified and wallet recharged successfully",
            "transactionId": verification_result["transaction_id"],
            "amount": verification_result["amount"],
            "newBalance": new_balance
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

@router.get("/rates")
async def get_consultation_rates():
    """Get current consultation rates"""
    return {
        "chat": 5.0,    # ₹5 per minute
        "voice": 8.0,   # ₹8 per minute
        "video": 12.0   # ₹12 per minute
    }

@router.get("/rates/{professional_id}")
async def get_professional_rates(professional_id: str):
    """Get professional's custom rates"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT chat_rate, voice_rate, video_rate 
            FROM professional_rates 
            WHERE professional_id = ?
        """, (professional_id,))
        
        rates = cursor.fetchone()
        conn.close()
        
        if rates:
            return {
                "chat": rates['chat_rate'],
                "voice": rates['voice_rate'],
                "video": rates['video_rate']
            }
        else:
            # Return default rates if no custom rates set
            return {
                "chat": 5.0,
                "voice": 8.0,
                "video": 12.0
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching professional rates: {str(e)}")

# Professional Wallet Endpoints
@router.get("/professional/balance")
async def get_professional_balance(professionalId: str):
    """Get professional's wallet balance"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get existing balance
        cursor.execute("SELECT * FROM professional_wallet_balances WHERE professional_id = ?", (professionalId,))
        balance = cursor.fetchone()
        
        if not balance:
            # Create new wallet for professional
            wallet_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO professional_wallet_balances 
                (id, professional_id, balance, total_earned, total_withdrawn, currency, last_updated)
                VALUES (?, ?, 0.0, 0.0, 0.0, 'INR', ?)
            """, (wallet_id, professionalId, datetime.utcnow().isoformat()))
            conn.commit()
            
            # Fetch the newly created balance
            cursor.execute("SELECT * FROM professional_wallet_balances WHERE professional_id = ?", (professionalId,))
            balance = cursor.fetchone()
        
        conn.close()
        
        return ProfessionalBalanceResponse(
            id=balance['id'],
            professionalId=balance['professional_id'],
            balance=balance['balance'],
            totalEarned=balance['total_earned'],
            totalWithdrawn=balance['total_withdrawn'],
            currency=balance['currency'],
            lastUpdated=balance['last_updated']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching professional balance: {str(e)}")

@router.post("/professional/withdraw")
async def request_withdrawal(professionalId: str, request: WithdrawRequest):
    """Request withdrawal of professional earnings"""
    try:
        if request.amount < 100:
            raise HTTPException(status_code=400, detail="Minimum withdrawal amount is ₹100")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get professional wallet
        cursor.execute("SELECT * FROM professional_wallet_balances WHERE professional_id = ?", (professionalId,))
        wallet = cursor.fetchone()
        
        if not wallet:
            conn.close()
            raise HTTPException(status_code=404, detail="Professional wallet not found")
        
        if wallet['balance'] < request.amount:
            conn.close()
            raise HTTPException(status_code=400, detail="Insufficient balance for withdrawal")
        
        # Create withdrawal request
        withdrawal_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO professional_withdrawals 
            (id, professional_id, amount, bank_account, ifsc_code, account_holder, status, requested_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
        """, (
            withdrawal_id, professionalId, request.amount, request.bank_account,
            request.ifsc_code, request.account_holder, datetime.utcnow().isoformat()
        ))
        
        # Update professional wallet balance
        new_balance = wallet['balance'] - request.amount
        new_total_withdrawn = wallet['total_withdrawn'] + request.amount
        
        cursor.execute("""
            UPDATE professional_wallet_balances 
            SET balance = ?, total_withdrawn = ?, last_updated = ?
            WHERE professional_id = ?
        """, (new_balance, new_total_withdrawn, datetime.utcnow().isoformat(), professionalId))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "withdrawalId": withdrawal_id,
            "amount": request.amount,
            "remainingBalance": new_balance,
            "message": "Withdrawal request submitted successfully. It will be processed within 2-3 business days."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Withdrawal request failed: {str(e)}")

@router.get("/professional/withdrawals")
async def get_withdrawal_history(professionalId: str):
    """Get professional's withdrawal history"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM professional_withdrawals 
            WHERE professional_id = ? 
            ORDER BY requested_at DESC
        """, (professionalId,))
        
        withdrawals = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": w['id'],
                "amount": w['amount'],
                "bankAccount": w['bank_account'][-4:],  # Show only last 4 digits
                "ifscCode": w['ifsc_code'],
                "accountHolder": w['account_holder'],
                "status": w['status'],
                "requestedAt": w['requested_at'],
                "processedAt": w['processed_at'],
                "transactionId": w['transaction_id'],
                "notes": w['notes']
            } for w in withdrawals
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching withdrawal history: {str(e)}")

@router.get("/professional/earnings")
async def get_professional_earnings(professionalId: str):
    """Get professional's earnings breakdown"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get commission breakdown
        cursor.execute("""
            SELECT 
                COUNT(*) as total_sessions,
                SUM(gross_amount) as total_gross,
                SUM(commission_amount) as total_commission,
                SUM(net_amount) as total_net,
                AVG(commission_rate) as avg_commission_rate
            FROM platform_commissions 
            WHERE professional_id = ?
        """, (professionalId,))
        
        earnings = cursor.fetchone()
        
        # Get monthly breakdown
        cursor.execute("""
            SELECT 
                strftime('%Y-%m', created_at) as month,
                COUNT(*) as sessions,
                SUM(gross_amount) as gross_amount,
                SUM(commission_amount) as commission_amount,
                SUM(net_amount) as net_amount
            FROM platform_commissions 
            WHERE professional_id = ?
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month DESC
            LIMIT 12
        """, (professionalId,))
        
        monthly_breakdown = cursor.fetchall()
        conn.close()
        
        return {
            "totalSessions": earnings['total_sessions'] or 0,
            "totalGrossEarnings": earnings['total_gross'] or 0.0,
            "totalCommission": earnings['total_commission'] or 0.0,
            "totalNetEarnings": earnings['total_net'] or 0.0,
            "commissionRate": earnings['avg_commission_rate'] or 0.30,
            "monthlyBreakdown": [
                {
                    "month": m['month'],
                    "sessions": m['sessions'],
                    "grossAmount": m['gross_amount'],
                    "commissionAmount": m['commission_amount'],
                    "netAmount": m['net_amount']
                } for m in monthly_breakdown
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching professional earnings: {str(e)}")