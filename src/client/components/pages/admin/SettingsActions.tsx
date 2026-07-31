export default function SettingsActions() {
	return (
		<footer class="admin-actions">
			<span>Owned by this browser session</span>
			<div class="admin-actions-buttons">
				<button class="admin-button" type="submit" name="action" value="update">Save settings</button>
				<button class="admin-button admin-button-danger" type="submit" name="action" value="unclaim">Unclaim</button>
			</div>
		</footer>
	);
}
