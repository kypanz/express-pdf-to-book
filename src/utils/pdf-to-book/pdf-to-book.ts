import { PdfReader } from "pdfreader";
const FOLDER_PATH = "./files";

interface ICanYouRead {
  name_book : string;
  pages_amount: number;
}

async function canYouRead({ name_book, pages_amount } : ICanYouRead) {
  try {
    const book = {
      pages: ["empty page"],
    };
    let current_page = 0;
    let current_text = "";
    await new Promise((resolve, reject) => {
      new PdfReader({}).parseFileItems(
        `${FOLDER_PATH}/${name_book}.pdf`,
        (err, item) => {
          if (err) {
            console.error("error:", err);
            reject();
          }
          if (!item) {
            // Adding the last page and then resolve
            book.pages[current_page] = current_text;
            // console.warn("end of file");
            resolve();
          } else if (
            item &&
            item.page != current_page &&
            item.page != undefined
          ) {
            book.pages[current_page] = current_text;
            current_page = item.page;
          } else if (item.text && item.text != undefined) {
            current_text += item.text;
          }
        },
      );
    });
    console.log(book.pages[1]);
  } catch (error) {
    console.error("can't read the pdf");
  }
}

canYouRead();
