"""
Payment Gateway Integration for Wallet System
Supports multiple payment methods: UPI, Cards, Net Banking, Wallets
"""

import os
import uuid
import hashlib
import hmac
import json
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import HTTPException
import requests

class PaymentGateway:
    """Payment Gateway Handler"""
    
    def __init__(self):
        # Payment gateway configurations
        self.razorpay_key_id = os.getenv("RAZORPAY_KEY_ID", "")
        self.razorpay_key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
        self.payu_merchant_key = os.getenv("PAYU_MERCHANT_KEY", "")
        self.payu_merchant_salt = os.getenv("PAYU_MERCHANT_SALT", "")
        self.phonepe_merchant_id = os.getenv("PHONEPE_MERCHANT_ID", "")
        self.phonepe_salt_key = os.getenv("PHONEPE_SALT_KEY", "")
        
        # Test mode flag
        self.test_mode = os.getenv("PAYMENT_TEST_MODE", "true").lower() == "true"
    
    def create_payment_order(self, amount: float, currency: str = "INR", 
                           payment_method: str = "upi", user_id: str = None) -> Dict[str, Any]:
        """Create a payment order"""
        try:
            order_id = f"order_{uuid.uuid4().hex[:12]}"
            
            if self.test_mode:
                # Mock payment for testing
                return {
                    "success": True,
                    "order_id": order_id,
                    "amount": amount,
                    "currency": currency,
                    "payment_method": payment_method,
                    "payment_url": f"https://mock-payment.example.com/pay/{order_id}",
                    "test_mode": True,
                    "message": "Test payment order created successfully"
                }
            
            # Real payment gateway integration
            if payment_method in ["upi", "card", "netbanking"]:
                return self._create_razorpay_order(amount, currency, order_id)
            elif payment_method == "phonepe":
                return self._create_phonepe_order(amount, currency, order_id, user_id)
            elif payment_method == "payu":
                return self._create_payu_order(amount, currency, order_id, user_id)
            else:
                raise HTTPException(status_code=400, detail="Unsupported payment method")
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Payment order creation failed: {str(e)}")
    
    def _create_razorpay_order(self, amount: float, currency: str, order_id: str) -> Dict[str, Any]:
        """Create Razorpay payment order"""
        if not self.razorpay_key_id or not self.razorpay_key_secret:
            raise HTTPException(status_code=500, detail="Razorpay credentials not configured")
        
        try:
            import razorpay
            client = razorpay.Client(auth=(self.razorpay_key_id, self.razorpay_key_secret))
            
            order_data = {
                "amount": int(amount * 100),  # Amount in paise
                "currency": currency,
                "receipt": order_id,
                "payment_capture": 1
            }
            
            order = client.order.create(data=order_data)
            
            return {
                "success": True,
                "order_id": order["id"],
                "amount": amount,
                "currency": currency,
                "razorpay_key": self.razorpay_key_id,
                "payment_method": "razorpay",
                "test_mode": False
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Razorpay order creation failed: {str(e)}")
    
    def _create_phonepe_order(self, amount: float, currency: str, order_id: str, user_id: str) -> Dict[str, Any]:
        """Create PhonePe payment order"""
        if not self.phonepe_merchant_id or not self.phonepe_salt_key:
            raise HTTPException(status_code=500, detail="PhonePe credentials not configured")
        
        try:
            payload = {
                "merchantId": self.phonepe_merchant_id,
                "merchantTransactionId": order_id,
                "merchantUserId": user_id,
                "amount": int(amount * 100),  # Amount in paise
                "redirectUrl": "https://your-app.com/payment/callback",
                "redirectMode": "POST",
                "callbackUrl": "https://your-app.com/payment/webhook",
                "paymentInstrument": {
                    "type": "PAY_PAGE"
                }
            }
            
            # Create checksum
            base64_payload = self._encode_base64(json.dumps(payload))
            checksum = self._create_phonepe_checksum(base64_payload)
            
            headers = {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "accept": "application/json"
            }
            
            response = requests.post(
                "https://api.phonepe.com/apis/hermes/pg/v1/pay",
                json={"request": base64_payload},
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "order_id": order_id,
                    "amount": amount,
                    "currency": currency,
                    "payment_url": result["data"]["instrumentResponse"]["redirectInfo"]["url"],
                    "payment_method": "phonepe",
                    "test_mode": False
                }
            else:
                raise HTTPException(status_code=500, detail="PhonePe API error")
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PhonePe order creation failed: {str(e)}")
    
    def _create_payu_order(self, amount: float, currency: str, order_id: str, user_id: str) -> Dict[str, Any]:
        """Create PayU payment order"""
        if not self.payu_merchant_key or not self.payu_merchant_salt:
            raise HTTPException(status_code=500, detail="PayU credentials not configured")
        
        try:
            # PayU hash calculation
            hash_string = f"{self.payu_merchant_key}|{order_id}|{amount}|ArambhGPT Wallet Recharge|{user_id}|||||||||||{self.payu_merchant_salt}"
            hash_value = hashlib.sha512(hash_string.encode()).hexdigest()
            
            return {
                "success": True,
                "order_id": order_id,
                "amount": amount,
                "currency": currency,
                "merchant_key": self.payu_merchant_key,
                "hash": hash_value,
                "payment_url": "https://secure.payu.in/_payment",
                "payment_method": "payu",
                "test_mode": False
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PayU order creation failed: {str(e)}")
    
    def verify_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Verify payment status"""
        try:
            if self.test_mode:
                # Mock verification for testing
                return {
                    "success": True,
                    "verified": True,
                    "transaction_id": f"txn_{uuid.uuid4().hex[:12]}",
                    "amount": payment_data.get("amount", 0),
                    "status": "success",
                    "message": "Test payment verified successfully"
                }
            
            payment_method = payment_data.get("payment_method", "")
            
            if payment_method == "razorpay":
                return self._verify_razorpay_payment(payment_data)
            elif payment_method == "phonepe":
                return self._verify_phonepe_payment(payment_data)
            elif payment_method == "payu":
                return self._verify_payu_payment(payment_data)
            else:
                raise HTTPException(status_code=400, detail="Unsupported payment method for verification")
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")
    
    def _verify_razorpay_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Verify Razorpay payment"""
        try:
            import razorpay
            client = razorpay.Client(auth=(self.razorpay_key_id, self.razorpay_key_secret))
            
            # Verify signature
            params_dict = {
                'razorpay_order_id': payment_data.get('order_id'),
                'razorpay_payment_id': payment_data.get('payment_id'),
                'razorpay_signature': payment_data.get('signature')
            }
            
            client.utility.verify_payment_signature(params_dict)
            
            # Fetch payment details
            payment = client.payment.fetch(payment_data.get('payment_id'))
            
            return {
                "success": True,
                "verified": True,
                "transaction_id": payment["id"],
                "amount": payment["amount"] / 100,  # Convert from paise
                "status": payment["status"],
                "method": payment["method"],
                "message": "Payment verified successfully"
            }
            
        except Exception as e:
            return {
                "success": False,
                "verified": False,
                "message": f"Razorpay verification failed: {str(e)}"
            }
    
    def _verify_phonepe_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Verify PhonePe payment"""
        try:
            transaction_id = payment_data.get("transaction_id")
            
            # Check payment status
            checksum = self._create_phonepe_checksum(f"/pg/v1/status/{self.phonepe_merchant_id}/{transaction_id}")
            
            headers = {
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": self.phonepe_merchant_id,
                "accept": "application/json"
            }
            
            response = requests.get(
                f"https://api.phonepe.com/apis/hermes/pg/v1/status/{self.phonepe_merchant_id}/{transaction_id}",
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "verified": result["success"],
                    "transaction_id": transaction_id,
                    "amount": result["data"]["amount"] / 100,
                    "status": result["data"]["state"],
                    "message": "PhonePe payment verified"
                }
            else:
                raise Exception("PhonePe API error")
                
        except Exception as e:
            return {
                "success": False,
                "verified": False,
                "message": f"PhonePe verification failed: {str(e)}"
            }
    
    def _verify_payu_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Verify PayU payment"""
        try:
            # PayU sends POST data to success/failure URLs
            # Verify hash
            received_hash = payment_data.get("hash")
            
            # Reconstruct hash
            hash_string = f"{self.payu_merchant_salt}|{payment_data.get('status')}||||||||||{payment_data.get('email')}|{payment_data.get('firstname')}|{payment_data.get('productinfo')}|{payment_data.get('amount')}|{payment_data.get('txnid')}|{self.payu_merchant_key}"
            calculated_hash = hashlib.sha512(hash_string.encode()).hexdigest()
            
            if received_hash == calculated_hash:
                return {
                    "success": True,
                    "verified": True,
                    "transaction_id": payment_data.get("mihpayid"),
                    "amount": float(payment_data.get("amount", 0)),
                    "status": payment_data.get("status"),
                    "message": "PayU payment verified"
                }
            else:
                return {
                    "success": False,
                    "verified": False,
                    "message": "PayU hash verification failed"
                }
                
        except Exception as e:
            return {
                "success": False,
                "verified": False,
                "message": f"PayU verification failed: {str(e)}"
            }
    
    def _encode_base64(self, data: str) -> str:
        """Encode string to base64"""
        import base64
        return base64.b64encode(data.encode()).decode()
    
    def _create_phonepe_checksum(self, payload: str) -> str:
        """Create PhonePe checksum"""
        checksum_string = payload + "/pg/v1/pay" + self.phonepe_salt_key
        return hashlib.sha256(checksum_string.encode()).hexdigest() + "###1"

# Global payment gateway instance
payment_gateway = PaymentGateway()