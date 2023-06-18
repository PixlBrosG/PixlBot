function showPanel(panelIndex)
{
	var panels = document.getElementsByClassName("panel");
	var buttons = document.getElementsByTagName("button");
	for (var i = 0; i < panels.length; i++)
	{
		panels[i].classList.remove("active");
		buttons[i].classList.remove("active");
	}
	panels[panelIndex].classList.add("active");
	buttons[panelIndex].classList.add("active");
}
