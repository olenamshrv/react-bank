export const toggleButton = (buttonName: string="button", disabled: boolean) => {
  const buttonElements = document.querySelectorAll(`.${buttonName}`);

  buttonElements.forEach((item) => {
    item.classList.toggle("button--disabled", disabled)
    item.toggleAttribute("disabled", disabled)
  })
}