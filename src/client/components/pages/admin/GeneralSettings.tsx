import Core from "../../../../core.js";
import { formValue, FormValues } from "../../util/form.js";

export default function GeneralSettings(props: { values?: FormValues }) {
	const pizza = Core.services.pizza;
	const buyerName = props.values ? formValue(props.values.buyerName) : pizza.buyerName;
	const sliceCount = props.values ? formValue(props.values.sliceCount) : String(pizza.sliceCount);

	return (
		<section class="admin-settings-general">
			<h2>Order settings</h2>
			<div class="admin-field-grid">
				<label class="admin-field"><span>Buyer name</span><input name="buyerName" value={buyerName} maxlength="80" required /></label>
				<label class="admin-field"><span>Slice count</span><input name="sliceCount" type="number" value={sliceCount} min="8" max="80" step="8" required /></label>
			</div>
		</section>
	);
}
