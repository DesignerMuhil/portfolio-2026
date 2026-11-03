import DecryptedText from "../DecryptedText/DecryptedText";

/* =========================================================
   HOVER TEXT
   One place to tune the hover animation for every menu,
   nav and CTA label. Hovering anywhere on the surrounding
   <a> or <button> (padding included) plays the effect.

   Usage:  <HoverText text="MENU" />
   Override any setting per use:  <HoverText text="X" speed={30} />
========================================================= */

const HoverText = ({ text, ...props }) => (
  <DecryptedText
    text={text}
    animateOn="hover"
    hoverTarget="a, button"
    sequential
    revealDirection="start"
    speed={40}
    maxIterations={10}
    {...props}
  />
);

export default HoverText;