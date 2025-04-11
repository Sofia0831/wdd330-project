export function updateFooter(footerElement) {
    const currentYear = new Date().getFullYear();
    const lastModifiedDate = document.lastModified;
  
    const footerParagraphs = footerElement.querySelectorAll("p");
      footerParagraphs[0].textContent = `Copyright © ${currentYear} SOFIA PANTAS | WDD330 PROJECT`;
      footerParagraphs[1].textContent = `Last modified: ${lastModifiedDate}`;
  
  }
