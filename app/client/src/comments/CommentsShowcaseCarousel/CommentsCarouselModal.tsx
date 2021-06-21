import React from "react";
import ModalComponent from "components/designSystems/blueprint/ModalComponent";
import { Layers } from "constants/Layers";

function ShowcaseCarouselModal({ children }: { children: React.ReactNode }) {
  function logClose() {
    console.log("handle close");
  }

  return (
    <ModalComponent
      bottom={25}
      canEscapeKeyClose
      canOutsideClickClose
      data-cy={"help-modal"}
      hasBackDrop={false}
      isOpen
      left={25}
      onClose={logClose}
      overlayClassName="comments-onboarding-carousel"
      scrollContents
      width={325}
      zIndex={Layers.appComments}
    >
      {children}
    </ModalComponent>
  );
}

export default ShowcaseCarouselModal;
