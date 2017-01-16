function devices(table) {
	const indexToName = table.groups[0].buttons.name();
	const items = table.rows().map((row, index) => {
		const data = {};
		row.textFields().forEach((text, i) => {
			data[indexToName[i].toLowerCase()] = text.value();
		});
		return {
			title: data.name,
			subtitle: data.type,
			icon: {
				path: row.selected() ? 'sound.png' : 'no-sound.png'
			},
			arg: index
		};
	});

	return JSON.stringify({
		items
	});
}

function error(err) {
	return JSON.stringify({
		items: [{
			title: err.toString()
		}]
	});
}

function run(argv) {
	const deviceIndex = argv.length > 0 ? parseInt(argv[0], 10) : -1;
	const prefName = 'System Preferences';

	try {
		Application(prefName)
			.panes()
			.filter(pane => pane.id().includes('.sound'))[0]
			.anchors()
			.filter(anchor => anchor.name() === 'output')[0]
			.reveal();

		delay(0.5);

		const se = Application('System Events');
		const p = se.processes[prefName];
		const table = p.windows[0].tabGroups[0].scrollAreas[0].tables[0];

		if (deviceIndex < 0) {
			// show devices
			return devices(table);
		}

		// select a device
		table.rows[deviceIndex].select();
	} catch (err) {
		return error(err);
	}
}

