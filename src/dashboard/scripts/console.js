const consoleContainer = document.getElementById('console');

function GenerateConsoleEntry(entry)
{
	const entryElement = document.createElement('p');
	entryElement.textContent = entry.message;
	entryElement.classList.add('log-entry', `log-${entry.level}`);

	consoleContainer.appendChild(entryElement);
}

function GenerateConsoleEntries(entries)
{
	entries.forEach(entry =>
	{
		const entryElement = document.createElement('p');
		entryElement.textContent = entry.message;
		entryElement.classList.add('log-entry', `log-${entry.level}`);

		consoleContainer.appendChild(entryElement);
	});
}

async function executeCommand()
{
	const inputField = document.getElementById('inputField');
	const command = inputField.value.trim();
	
	try
	{
		const result = eval.call({}, command);
		if (result)
			GenerateConsoleEntry({ level: 'log', message: result });
	}
	catch (error)
	{
		GenerateConsoleEntry({ level: 'error', message: error.message });
	}

	inputField.value = '';
}

// Execute command on Enter key press
const inputField = document.getElementById('inputField');
inputField.addEventListener('keydown', function(event)
{
	if (event.key === 'Enter') 
	{
		executeCommand();
	}
});

// Console log hooks

console.stdlog = console.log.bind(console);
console.log = function(){
	GenerateConsoleEntry({ type: 'info', message: Array.from(arguments).join(' ') });
	console.stdlog.apply(console, arguments);
}

console.stdinfo = console.info.bind(console);
console.info = function(){
	GenerateConsoleEntry({ type: 'info', message: Array.from(arguments).join(' ') });
	console.stdinfo.apply(console, arguments);
}

console.stdwarn = console.warn.bind(console);
console.warn = function(){
	GenerateConsoleEntry({ type: 'warn', message: Array.from(arguments).join(' ') });
	console.stdwarn.apply(console, arguments);
}

console.stderror = console.error.bind(console);
console.error = function(){
	GenerateConsoleEntry({ type: 'error', message: Array.from(arguments).join(' ') });
	console.stderror.apply(console, arguments);
}
