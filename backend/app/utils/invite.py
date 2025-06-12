from app.config import BASE_URL

def send_invite(contact: str, game_id: str):
    invite_link = f"{BASE_URL}/{game_id}"

    if "@" in contact:
        print(f"[EMAIL] Invite sent to {contact}: {invite_link}")
        # Use SendGrid or Mailgun here
    else:
        print(f"[SMS] Invite sent to {contact}: {invite_link}")
        # Use Twilio here
