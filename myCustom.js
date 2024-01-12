let isAlreadyAdded = false;

window.addEventListener("elementCreated", (event) => {
  // This is for adding button.
  if(document.getElementsByClassName('closeBBB').length > 0) document.getElementsByClassName('closeBBB')[0].className += ' ant-btn ant-btn-circle ant-btn-default ant-btn-sm ant-btn-icon-only ';
  if (event.detail.length && !isAlreadyAdded) {
    isAlreadyAdded = true;

    const newButtonContainer = document.createElement("div");
    newButtonContainer.className = "ant-space-item";
    newButtonContainer.id = "v-pills-crm-tab";
    newButtonContainer.dataset.translateKey = "crmMode";
    newButtonContainer.title = "Modo CRM";
    newButtonContainer.setAttribute("onclick", "window.wacore.crm.opencrm(); document.getElementsByClassName('ant-btn-primary')[0].className = document.getElementsByClassName('ant-btn-primary')[0].className.replace(' ant-btn-primary', ''); document.getElementsByClassName('modoCRMBtn')[0].className += ' ant-btn-primary';");
    newButtonContainer.dataset.title = "crm";
    newButtonContainer.style.display = "block";

    const button = document.createElement("button");
    button.className = "ant-btn ant-btn-circle ant-btn-default ant-btn-lg ant-btn-icon-only d-flex align-items-center justify-content-center modoCRMBtn";


    // Create an image element
    const img = document.createElement("img");
    img.src = "https://womenfashionnova.com/wp-content/uploads/2023/12/system-regular-8-account.gif";
    img.alt = "New Image 10";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";

    // Append the image to the button
    button.appendChild(img);
    newButtonContainer.appendChild(button);

    // Append the button to the new div
    const newAntSpaceDom = event.detail[0].parentNode.parentNode;
    newAntSpaceDom.appendChild(newButtonContainer);

    // Create Form for button
    const newDivComponentForButton = document.createElement("div");
    newDivComponentForButton.setAttribute("class", "tab-pane withMenusIcons fade show active");
    newDivComponentForButton.setAttribute("id", "v-pills-connect");
    newDivComponentForButton.setAttribute("role", "tabpanel");
    newDivComponentForButton.setAttribute("aria-labelledby", "v-pills-whatsapp-button");
    newDivComponentForButton.setAttribute("style", "padding-top:0px;height: 100vh;overflow-x: hidden;overflow-y: hidden; z-index: 0;");

    const mainContentDom = document.querySelectorAll("._1jJ70")[0];
    mainContentDom.appendChild(newDivComponentForButton)

  }
});
