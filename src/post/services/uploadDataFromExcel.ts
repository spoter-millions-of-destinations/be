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
