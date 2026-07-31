import Core from "../../../../core.js";
import { Session } from "../../../../database/entities/Session.entity.js";
import { formValue, FormValues } from "../../util/form.js";
import AdminHeader from "./AdminHeader.js";
import ClaimForm from "./ClaimForm.js";
import SettingsForm from "./SettingsForm.js";

export default function AdminPage(props: { notice?: string; error?: string; values?: FormValues } = {}) {
	const pizza = Core.services.pizza;
	const session = Core.services.context.get<Session | undefined>("session");

	return (
		<div class="admin-page">
			<div class="admin-shell">
				<AdminHeader />
				<hgroup class="admin-intro"><h1>buyer admin</h1></hgroup>
				{props.notice && <blockquote class="admin-message" aria-live="polite">{props.notice}</blockquote>}
				{props.error && <blockquote class="admin-message error" aria-live="assertive">{props.error}</blockquote>}
				{pizza.isBuyer(session)
					? <SettingsForm values={props.values} />
					: <ClaimForm
						currentBuyer={pizza.buyerSession ? pizza.buyerName : ""}
						hasSession={Boolean(session)}
						buyerName={formValue(props.values?.buyerName)}
					/>}
			</div>
		</div>
	);
}
