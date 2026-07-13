# Sandbox setup

1. Create an FIU and Account Aggregator Data product in Setu Bridge.
2. Configure consent/FI notification URLs and the application callback URL over HTTPS.
3. Copy sandbox `x-client-id`, `x-client-secret`, and product instance ID into server environment variables.
4. Set the exact Bridge-approved purpose code, text, and reference URI.
5. Set `SETU_MODE=setu`, keep `SETU_ENV=sandbox`, and test using approved Setu sandbox FIPs/numbers.

Use an HTTPS tunnel for local callbacks. Sandbox OTP behavior belongs in private test operations documentation, never source or production UI.
