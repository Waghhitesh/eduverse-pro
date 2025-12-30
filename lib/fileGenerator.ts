import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import pptxgen from 'pptxgenjs';
import { saveAs } from 'file-saver';

// PDF Generation
export async function generatePDF(title: string, content: string, sections: string[]) {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, 20);

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

    let y = 45;

    // Sections
    sections.forEach((section, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${section}`, 20, y);
        y += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(content, 170);
        lines.forEach((line: string) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 20, y);
            y += 7;
        });
        y += 5;
    });

    // Save
    doc.save(`${title}.pdf`);
    return true;
}

// Word Document Generation
export async function generateWord(title: string, content: string, sections: string[]) {
    const sectionParagraphs = sections.map((section, index) => [
        new Paragraph({
            text: `${index + 1}. ${section}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
            children: [new TextRun(content)],
            spacing: { after: 200 },
        }),
    ]).flat();

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: title,
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Generated: ${new Date().toLocaleDateString()}`,
                                italics: true,
                            }),
                        ],
                        spacing: { after: 400 },
                    }),
                    ...sectionParagraphs,
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title}.docx`);
    return true;
}

// PowerPoint Generation
export async function generatePPT(title: string, content: string, sections: string[]) {
    const pres = new pptxgen();

    // Title slide
    const titleSlide = pres.addSlide();
    titleSlide.background = { color: '4e54c8' };
    titleSlide.addText(title, {
        x: 1,
        y: 2,
        w: 8,
        h: 1.5,
        fontSize: 36,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
    });
    titleSlide.addText(`Generated: ${new Date().toLocaleDateString()}`, {
        x: 1,
        y: 4,
        w: 8,
        h: 0.5,
        fontSize: 14,
        color: 'FFFFFF',
        align: 'center',
    });

    // Content slides
    sections.forEach((section, index) => {
        const slide = pres.addSlide();
        slide.addText(`${index + 1}. ${section}`, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.75,
            fontSize: 24,
            bold: true,
            color: '4e54c8',
        });

        slide.addText(content, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 4,
            fontSize: 14,
            color: '333333',
        });
    });

    await pres.writeFile({ fileName: `${title}.pptx` });
    return true;
}
