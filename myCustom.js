let isAlreadyAdded = false;

window.addEventListener("elementCreated", (event) => {
  // This is for adding button.
  
  if(document.getElementsByClassName('kanban_board_container').length > 0) document.getElementsByClassName('kanban_board_container')[0].innerHTML = `<div id="closeBtn" style="display: flex; justify-content: flex-end;cursor: pointer"  onclick="document.getElementById('screen').style.display='none'; document.getElementsByClassName('ant-btn-primary')[0].className = document.getElementsByClassName('ant-btn-primary')[0].className.replace(' ant-btn-primary', '');"><button type="button" class="closeBBB ant-btn ant-btn-circle ant-btn-default ant-btn-sm ant-btn-icon-only" style="width:40px;height:40px"><span role="img" class="anticon anticon-close"><svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></span></button>`

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

