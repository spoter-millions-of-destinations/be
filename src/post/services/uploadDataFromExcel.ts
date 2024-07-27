import * as xlsx from 'xlsx';

export const readExcelFile = (filePath: string) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const headers = data[0]; // lấy headers từ hàng đầu tiên

  const posts = data.slice(1).map((row) => {
    const post = {
      description: row[headers.indexOf('Title')] as string,
      images: (row[headers.indexOf('thumbnail')]
        ? [row[headers.indexOf('thumbnail')]]
        : []) as string[],
      longitude: row[headers.indexOf('longitude')] as number,
      latitude: row[headers.indexOf('latitude')] as number,
    };
    return post;
  });

  return posts;
};

export const readAttractionData = (workbook: xlsx.WorkBook) => {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const headers = data[0]; // lấy headers từ hàng đầu tiên
  let index = 0;

  const attractions = data.slice(1).map((row) => {
    if(index >= 30) return;
    const attraction = {
      order: row[headers.indexOf('Order')] as number,
      name: row[headers.indexOf('Name')] as string,
      description: row[headers.indexOf('Description')] as string,
      rate: row[headers.indexOf('Rate')] as number,
      longitude: row[headers.indexOf('Longitude')] as number,
      latitude: row[headers.indexOf('Latitude')] as number,
    };
    index++;
    return attraction;
  });

  return attractions;
};

export const readPostData = (workbook: xlsx.WorkBook) => {
  const sheetName = workbook.SheetNames[1];
  const sheet = workbook.Sheets[sheetName];

  const data: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const headers = data[0]; // lấy headers từ hàng đầu tiên

  let index = 0;

  const posts = data.slice(1).map((row) => {
    if(index >= 13) return;
    const post = {
      attractionOrder: row[headers.indexOf('AttractionOrder')] as number,
      order: row[headers.indexOf('Order')] as number,
      description: row[headers.indexOf('Description')] as string,
      rate: row[headers.indexOf('Rate')] as number,
      longitude: row[headers.indexOf('Longitude')] as number,
      latitude: row[headers.indexOf('Latitude')] as number,
      images: (row[headers.indexOf('Images')]
        ? [row[headers.indexOf('Images')]]
        : []) as string[],
    };
    index++;
    return post;
  });

  return posts;
};

export const readCollectionData = (workbook: xlsx.WorkBook) => {
  const sheetName = workbook.SheetNames[2];
  const sheet = workbook.Sheets[sheetName];

  const data: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const headers = data[0]; // lấy headers từ hàng đầu tiên

  const collections = data.slice(1).map((row) => {
    const collection = {
      postOrders: (row[headers.indexOf('PostOrder')] as string),
      description: row[headers.indexOf('Description')] as string,
      name: row[headers.indexOf('Name')] as string,
      image: row[headers.indexOf('Image')] as string,
    };
    return collection;
  });

  return collections;
};

export const readCommentData = (workbook: xlsx.WorkBook) => {
  const sheetName = workbook.SheetNames[3];
  const sheet = workbook.Sheets[sheetName];

  const data: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const headers = data[0]; // lấy headers từ hàng đầu tiên

  const comments = data.slice(1).map((row) => {
    const comment = {
      postOrder: row[headers.indexOf('PostOrder')] as number,
      content: row[headers.indexOf('Comment')] as string,
    };
    return comment;
  });

  return comments;
};

export const readDataFromExcelFile = (filePath: string) => {
  const workbook = xlsx.readFile(filePath);
  
  const attractions = readAttractionData(workbook);
  const posts = readPostData(workbook);
  const collections = readCollectionData(workbook);
  const comments = readCommentData(workbook);

  return { attractions, posts, collections, comments };
};
