/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { ReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/receipt_screen";
import { patch } from "@web/core/utils/patch";

patch(ReceiptScreen.prototype, {
    _whatsappCountryCode() {
        const partner = this.currentOrder.getPartner();
        const country = partner?.country_id || this.pos.company.country_id;
        return (country?.phone_code || "").toString().replace(/\D/g, "");
    },

    _waReceiptText() {
        const order = this.currentOrder;
        const fmt = (val) => this.env.utils.formatCurrency(val);
        const lines = order.getOrderlines().map(
            (l) => `${l.qty} x ${l.getFullProductName()}  ${fmt(l.priceIncl)}`
        );
        return [
            `*${this.pos.company.name}*`,
            `${_t("Receipt")}: ${order.pos_reference || order.name}`,
            "--------------------",
            ...lines,
            "--------------------",
            `${_t("Total")}: ${fmt(order.priceIncl)}`,
            "",
            _t("Thank you for your purchase!"),
        ].join("\n");
    },

    actionSendReceiptOnWhatsApp() {
        let phone = (this.state.phone || "").replace(/\D/g, "");
        const cc = this._whatsappCountryCode();
        if (phone.startsWith("0") && !cc) {
            this.notification.add(
                _t("Set a customer country or enter an international WhatsApp number."),
                { type: "warning" }
            );
            return;
        }
        if (cc && phone.startsWith("0")) {
            phone = cc + phone.slice(1);
        } else if (cc && phone && !phone.startsWith(cc)) {
            phone = cc + phone;
        }
        if (!phone) {
            this.notification.add(_t("Enter a valid phone number for WhatsApp."), {
                type: "warning",
            });
            return;
        }
        const params = new URLSearchParams({
            phone,
            text: this._waReceiptText(),
        });
        const url = `https://web.whatsapp.com/send?${params.toString()}`;
        window.open(url, "_blank");
    },
});
