import Core from "../../../core.js";
import { Session } from "../../../database/entities/Session.entity.js";
import AdminStakeTableContent from "./AdminStakeTableContent.js";

export const component = { id: "shared.admin-stakes" } as const;

export const AdminStakesChannel = Core.services.sse.registerChannel(
	{
		pattern: /^admin-stakes$/,
		permissionCheck: async (session) => Core.services.pizza.isBuyer(session),
	},
	"admin-stakes",
);

export default async function AdminStakes() {
	const pizza = Core.services.pizza;
	const session = Core.services.context.get<Session | undefined>("session");
	if (!pizza.isBuyer(session)) return "";

	return (
		<section
			id="admin-stakes"
			class="admin-stakes"
			sse-connect="/events/admin-stakes"
			sse-swap="admin-stakes"
			hx-swap="outerHTML"
		>
			<h2>Current stakes ({pizza.stakes.length})</h2>
			{pizza.stakes.length ? (
				<div class="admin-stakes-table">
					<table class="canonical wide">
						<AdminStakeTableContent />
					</table>
				</div>
			) : (
				<p class="admin-stakes-empty">No stakes yet.</p>
			)}
		</section>
	);
}

export const event = AdminStakes;
