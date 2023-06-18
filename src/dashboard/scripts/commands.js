const commandListContainer = document.getElementById('command-list');

/**
 * @param {string} name
 */
function CommandListEntryReload(name)
{
	SendData('loader', { type: 'reload', command: name });
}

/**
 * @param {{ category: string, name: string }} entry
 */
function GenerateCommandListEntry(entry)
{
	const panel = document.createElement("div");
	panel.classList.add('command-list-entry');
	panel.id = `command-list-entry-${entry.name}`;

	const text = document.createElement('h2');
	text.textContent = entry.name;

	const buttons = document.createElement("div");
	buttons.classList.add("buttons");

	const button1 = document.createElement("img");
	button1.classList.add("button");
	button1.src = "assets/reload.png";
	button1.onclick = () => { CommandListEntryReload(entry.name) };

	const button2 = document.createElement("img");
	button2.classList.add("button");
	button2.src = "assets/toggle.png";

	buttons.appendChild(button1);
	buttons.appendChild(button2);

	panel.appendChild(text);
	panel.appendChild(buttons);

	commandListContainer.appendChild(panel);
}

/**
 * @param {{ category: string, name: string }[]} entries
 */
function GenerateCommandListEntries(entries)
{
	entries.forEach(entry => GenerateCommandListEntry(entry));
}
