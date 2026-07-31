import { FormValues } from "../../util/form.js";
import GeneralSettings from "./GeneralSettings.js";
import PaymentSettings from "./PaymentSettings.js";
import SettingsActions from "./SettingsActions.js";
import StakesTable from "./StakesTable.js";

export default function SettingsForm(props: { values?: FormValues }) {
	return (
		<form class="admin-settings admin-form canonical" method="post" action="/-/pages.admin" hx-post="/-/pages.admin" hx-target=".admin-page" hx-swap="outerHTML">
			<GeneralSettings values={props.values} />
			<PaymentSettings values={props.values} />
			<StakesTable />
			<SettingsActions />
		</form>
	);
}
