import Core from "../../../../core.js";
import PizzaService, { ConfigurablePaymentMethod } from "../../../../services/pizza/pizzaService.js";
import { formValue, FormValues } from "../../util/form.js";

export default function PaymentMethodField(props: { method: ConfigurablePaymentMethod; values?: FormValues }) {
	const pizza = Core.services.pizza;
	const preset = PizzaService.PAYMENT_METHOD_PRESETS[props.method];
	const savedValue = pizza.enabledPaymentMethods[props.method];
	const value = props.values
		? formValue(props.values[`payment_${props.method}`])
		: savedValue ? PizzaService.formatPaymentUsername(props.method, savedValue) : "";
	const enabled = props.values
		? Boolean(formValue(props.values[`enabled_${props.method}`]))
		: savedValue !== undefined;

	return (
		<fieldset class="admin-payment-method">
			<label class="admin-toggle"><input type="checkbox" name={`enabled_${props.method}`} checked={enabled} /><span>{preset.name}</span></label>
			<label class="admin-field"><span>{preset.label}</span><input name={`payment_${props.method}`} value={value} maxlength="100" placeholder={preset.placeholder} /></label>
		</fieldset>
	);
}
