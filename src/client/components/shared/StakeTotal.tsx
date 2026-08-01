import Core from "../../../core.js";
import { formatMoney } from "../util/money.js";

export const component = { id: "shared.stake-total" } as const;

export const StakeTotalChannel = Core.services.sse.registerChannel(
	{
		pattern: /stake-total/,
	},
	"stake-total",
);

export default async function StakeTotal() {
	return (
		<p
			id="stake-total"
			class="stake-total"
			sse-connect="/events/stake-total"
			sse-swap="stake-total"
			hx-swap="outerHTML"
		>
			<span>Currently staked</span>
			<strong>${formatMoney(Core.services.pizza.stakeValue)}</strong>
		</p>
	);
}

export const event = StakeTotal;
