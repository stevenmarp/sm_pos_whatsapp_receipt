odoo.define('sm_pos_whatsapp_receipt.whatsapp_button', function (require) {
    'use strict';

    const ReceiptScreen = require('point_of_sale.ReceiptScreen');
    const Registries = require('point_of_sale.Registries');

    const WhatsappReceiptScreen = (ReceiptScreen) =>
        class extends ReceiptScreen {
            setup() {
                super.setup();
                const partner = this.currentOrder.get_partner();
                this.orderUiState.inputPhone = this.orderUiState.inputPhone || (partner && partner.phone) || (partner && partner.mobile) || "";
            }

            _whatsappCountryCode() {
                const partner = this.currentOrder.get_partner();
                const country = partner?.country_id || this.env.pos.company.country_id;
                return (country?.phone_code || "").toString().replace(/\D/g, "");
            }

            _waReceiptText() {
                const order = this.currentOrder;
                const fmt = (val) => this.env.pos.format_currency(val);
                const lines = order.get_orderlines().map(
                    (l) => `${l.get_quantity()} x ${l.get_full_product_name()}  ${fmt(l.get_all_prices().priceWithTax)}`
                );
                return [
                    `*${this.env.pos.company.name}*`,
                    `${this.env._t("Receipt")}: ${order.pos_reference || order.get_name()}`,
                    "--------------------",
                    ...lines,
                    "--------------------",
                    `${this.env._t("Total")}: ${fmt(order.get_total_with_tax())}`,
                    "",
                    this.env._t("Thank you for your purchase!"),
                ].join("\n");
            }

            actionSendReceiptOnWhatsApp() {
                let phone = (this.orderUiState.inputPhone || "").replace(/\D/g, "");
                const cc = this._whatsappCountryCode();
                if (phone.startsWith("0") && !cc) {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t("Missing country code"),
                        body: this.env._t("Set a customer country or enter an international WhatsApp number."),
                    });
                    return;
                }
                if (cc && phone.startsWith("0")) {
                    phone = cc + phone.slice(1);
                } else if (cc && phone && !phone.startsWith(cc)) {
                    phone = cc + phone;
                }
                if (!phone) {
                    this.showPopup('ErrorPopup', {
                        title: this.env._t("Invalid phone number"),
                        body: this.env._t("Enter a valid phone number for WhatsApp."),
                    });
                    return;
                }
                const params = new URLSearchParams({
                    phone,
                    text: this._waReceiptText(),
                });
                const url = `https://web.whatsapp.com/send?${params.toString()}`;
                window.open(url, "_blank");
            }
        };

    Registries.Component.extend(ReceiptScreen, WhatsappReceiptScreen);
    return ReceiptScreen;
});
