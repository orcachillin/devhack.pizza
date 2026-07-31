import Core from "../../../core.js";
import { formatMoney } from "../util/money.js";
import ThermometerGoalMarkers from "./ThermometerGoalMarkers.js";

export const component = { id: "shared.thermometer" } as const;

export const ThermometerChannel = Core.services.sse.registerChannel(
	{
		pattern: /thermometer/,
	},
	"thermometer",
);

export default async function Thermometer(props: { height: number; money: number }) {
	return (
		<div
			class="thermometer-wrapper"
			id="thermometer"
			sse-swap="thermometer"
			hx-swap="morph"
			sse-connect="/events/thermometer"
		>
			<div class="thermometer">
				<div
					class="thermometer-temperature"
					style={`height:${props.height * 100}%`}
					data-value={`$${formatMoney(props.money)}`}
				></div>
				<ThermometerGoalMarkers />
			</div>
		</div>
	);
}

export const event = Thermometer;
