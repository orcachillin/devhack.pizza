export default function ClaimForm(props: { currentBuyer: string; hasSession: boolean; buyerName: string }) {
	return (
		<section class="admin-claim">
			<h2>Claim this pizza run</h2>
			<p>
				{props.currentBuyer
					? `This pizza run is currently managed by ${props.currentBuyer}. Claiming it will transfer control to this browser.`
					: "Claim ownership to configure the buyer and accepted payment methods."}
			</p>
			<form class="admin-form canonical" method="post" action="/-/pages.admin" hx-post="/-/pages.admin" hx-target=".admin-page" hx-swap="outerHTML">
				<input type="hidden" name="action" value="claim" />
				<label class="admin-field">
					<span>Buyer name</span>
					<input name="buyerName" value={props.buyerName} maxlength="80" placeholder="Who is ordering?" required />
				</label>
				<footer><button class="admin-button" type="submit" disabled={!props.hasSession}>Claim ownership</button></footer>
				{!props.hasSession && <small>A browser session is required before ownership can be claimed. You might need to enable cookies for this to work.</small>}
			</form>
		</section>
	);
}
