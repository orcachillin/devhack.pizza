import Core from "../../../../core.js";
import PizzaService, { PaymentMethod } from "../../../../services/pizza/pizzaService.js";
import { formValue, FormValues } from "../../util/form.js";

export default function StakeForm(props: { values?: FormValues }) {
	const pizza = Core.services.pizza;
	const selectedMethod = props.values ? formValue(props.values.paymentMethod) : pizza.availablePaymentMethods[0];
	const hasSelectedMethod = pizza.availablePaymentMethods.includes(selectedMethod as PaymentMethod);

	return (
		<form
			class="stake-form canonical"
			method="post"
			action="/-/pages.main"
			hx-post="/-/pages.main"
			hx-target=".main-page"
			hx-swap="outerHTML"
		>
			<label for="stake-payment-method">Payment method</label>
			<select id="stake-payment-method" name="paymentMethod" required>
				{selectedMethod && !hasSelectedMethod && (
					<option value={selectedMethod} selected hidden>{selectedMethod}</option>
				)}
				{pizza.availablePaymentMethods.map(method => (
					<option value={method} selected={method === selectedMethod}>
						{PizzaService.PAYMENT_METHOD_PRESETS[method].name}
					</option>
				))}
			</select>

			<label for="stake-username">Your username</label>
			<input
				id="stake-username"
				name="paymentUsername"
				value={formValue(props.values?.paymentUsername)}
				maxlength="100"
				required
			/>

			<label for="stake-value">Stake value</label>
			<input
				id="stake-value"
				name="value"
				type="number"
				value={formValue(props.values?.value)}
				min="0.01"
				max="10000"
				step="0.01"
				placeholder="0.00"
				required
			/>

			<footer>
				<button type="submit">Stake</button>
			</footer>
		</form>
	);
}
