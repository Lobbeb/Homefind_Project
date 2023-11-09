
document.addEventListener("DOMContentLoaded", function() {
    console.log("Page loaded!");

    
    var dropdowns = document.querySelectorAll(".dropdown-arrow");
    dropdowns.forEach(function(dropdown) {
     dropdown.addEventListener("click", function() {
        var content = this.nextElementSibling;
        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
        } else {
            content.classList.add('expanded');
        }
    });
});

      // To handle changing the button text:
     var dropdownLinks = document.querySelectorAll(".dropdown-content a");
     dropdownLinks.forEach(function(link) {
      link.addEventListener("click", function(e) {
        e.preventDefault();  // To prevent any default action
        var newText = this.textContent;
        this.closest('.split-button, .split-button-new').querySelector('.main-btn').textContent = newText;

        // Hide the dropdown content after a selection is made
        this.parentElement.classList.remove('expanded');
    });
});


    
    

    var buttons = document.querySelectorAll("#button-group-filled button");
    buttons.forEach(function(button) {
      button.addEventListener("click", function() {
        console.log("Button clicked!");
        // Remove active class from all buttons
        buttons.forEach(function(btn) {
          btn.classList.remove("active");
        });
        // Add active class to clicked button
        this.classList.add("active");
      });
    });


});
