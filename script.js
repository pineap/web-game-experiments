console.log("Web Game Experiment: Script loaded and ready!");

// A simple way to show interaction
document.getElementById('status').addEventListener('click', () => {
    const statusElement = document.getElementById('status');
    statusElement.innerText = "Status: You clicked the status!";
    statusElement.style.color = "#ff0";
});
