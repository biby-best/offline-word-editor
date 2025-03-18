import { AlignmentType, Document as DocxDocument, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

import { saveAs } from 'file-saver';
import { type Document } from '@/models/Document';

/**
 * Parse HTML content and convert it to DOCX elements
 * This is a simple implementation that handles basic formatting
 * For more complex HTML, a more robust HTML parser would be needed
 */
const parseHTMLToDocxElements = (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const elements = doc.body.children;
  
  const docxElements = [];
  
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    
    switch (element.tagName.toLowerCase()) {
      case 'h1':
        docxElements.push(
          new Paragraph({
            text: element.textContent || '',
            heading: HeadingLevel.HEADING_1
          })
        );
        break;
      case 'h2':
        docxElements.push(
          new Paragraph({
            text: element.textContent || '',
            heading: HeadingLevel.HEADING_2
          })
        );
        break;
      case 'h3':
        docxElements.push(
          new Paragraph({
            text: element.textContent || '',
            heading: HeadingLevel.HEADING_3
          })
        );
        break;
      case 'p':
        const textRuns: TextRun[] = [];
        const childNodes = element.childNodes;
        
        // If there are no child nodes or only text, create a simple paragraph
        if (childNodes.length === 0 || (childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE)) {
          docxElements.push(
            new Paragraph({
              text: element.textContent || ''
            })
          );
        } else {
          // Process mixed content (text, bold, italic, etc.)
          for (let j = 0; j < childNodes.length; j++) {
            const node = childNodes[j];
            
            if (node.nodeType === Node.TEXT_NODE) {
              textRuns.push(new TextRun({ text: node.textContent || '' }));
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const childElement = node as HTMLElement;
              
              switch (childElement.tagName.toLowerCase()) {
                case 'strong':
                case 'b':
                  textRuns.push(
                    new TextRun({
                      text: childElement.textContent || '',
                      bold: true
                    })
                  );
                  break;
                case 'em':
                case 'i':
                  textRuns.push(
                    new TextRun({
                      text: childElement.textContent || '',
                      italics: true
                    })
                  );
                  break;
                case 'u':
                  textRuns.push(
                    new TextRun({
                      text: childElement.textContent || '',
                      underline: {}
                    })
                  );
                  break;
                case 'a':
                  textRuns.push(
                    new TextRun({
                      text: childElement.textContent || '',
                      style: 'Hyperlink'
                    })
                  );
                  break;
                default:
                  textRuns.push(
                    new TextRun({
                      text: childElement.textContent || ''
                    })
                  );
              }
            }
          }
          
          if (textRuns.length > 0) {
            docxElements.push(
              new Paragraph({
                children: textRuns
              })
            );
          }
        }
        break;
      case 'ul':
      case 'ol':
        // For simplicity, convert list items to paragraphs with bullet points or numbers
        const listItems = element.getElementsByTagName('li');
        for (let j = 0; j < listItems.length; j++) {
          const prefix = element.tagName.toLowerCase() === 'ul' ? '• ' : `${j + 1}. `;
          docxElements.push(
            new Paragraph({
              text: `${prefix}${listItems[j].textContent || ''}`,
              indent: { left: 720 } // 720 twips = 0.5 inches
            })
          );
        }
        break;
      default:
        // For any other elements, just add their text content as a paragraph
        if (element.textContent && element.textContent.trim()) {
          docxElements.push(
            new Paragraph({
              text: element.textContent
            })
          );
        }
    }
  }
  
  return docxElements;
};

/**
 * Export document to Word (.docx) format
 */
export const exportToWord = async (document: Document) => {
  // Create the document title paragraph
  const titleParagraph = new Paragraph({
    text: document.title,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER
  });
  
  // Parse the HTML content to DOCX elements
  const contentElements = parseHTMLToDocxElements(document.content);
  
  // Create the DOCX document
  const doc = new DocxDocument({
    sections: [
      {
        properties: {},
        children: [
          titleParagraph,
          ...contentElements
        ]
      }
    ]
  });
  
  // Generate a blob from the document
  const blob = await Packer.toBlob(doc);
  
  // Save the blob as a file
  saveAs(blob, `${document.title}.docx`);
};