# -*- coding: utf-8 -*-
{
    "name": "POS WhatsApp Receipt",
    "version": "18.0.1.0.0",
    "category": "Point of Sale",
    "summary": "Send POS receipts over WhatsApp with a ready receipt message from the payment success screen.",
    "description": """
POS WhatsApp Receipt
====================

Adds a "WhatsApp" button on the POS receipt screen. The cashier can confirm or
enter the customer phone number and open WhatsApp Web with a ready receipt
message containing store name, receipt number, order lines and total.

* One tap from the Payment Successful screen
* Phone prefilled from the selected customer
* Leading local zero can be replaced by the customer or company country code
* Ready receipt message with items and total amount
* No WhatsApp API key, no QR server and no external gateway required
    """,
    "author": "Steven Marp",
    "website": "https://apps.odoo.com/apps/modules/browse?author=Steven Marp",
    "license": "OPL-1",
    "images": [
        "static/description/banner.gif",
        "static/description/icon.png",
        "static/description/pos_customer_mobile.png",
        "static/description/pos_receipt_whatsapp_button.png",
        "static/description/pos_whatsapp_message.png",
    ],
    "depends": ["point_of_sale"],
    "data": [],
    "assets": {
        "point_of_sale._assets_pos": [
            "sm_pos_whatsapp_receipt/static/src/receipt_screen/whatsapp_button.js",
            "sm_pos_whatsapp_receipt/static/src/receipt_screen/whatsapp_button.xml",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
    "price": 18.00,
    "currency": "USD",
}
