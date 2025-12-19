import puppeteer from 'puppeteer';
import { marked } from 'marked';

export const generateMarkdown = (prdContent: any): string => {
    let md = `# ${prdContent.title}\n\n`;

    md += `## Vision\n${prdContent.vision}\n\n`;

    md += `## User Personas\n`;
    prdContent.userPersonas?.forEach((p: any) => {
        md += `### ${p.role}\n${p.description}\n**Goals:**\n${p.goals?.map((g: string) => `- ${g}`).join('\n')}\n\n`;
    });

    md += `## User Stories\n`;
    prdContent.userStories?.forEach((s: any) => {
        md += `- As a **${s.role}**, I want to **${s.action}** so that **${s.benefit}**.\n`;
    });

    md += `\n## Functional Requirements\n`;
    prdContent.functionalRequirements?.forEach((r: any) => {
        md += `- **[${r.id}]** (${r.priority}) ${r.description}\n`;
    });

    md += `\n## Non-Functional Requirements\n`;
    prdContent.nonFunctionalRequirements?.forEach((r: any) => {
        md += `- **${r.category}**: ${r.requirement}\n`;
    });

    return md;
};

export const generatePDF = async (prdContent: any): Promise<Buffer> => {
    const markdown = generateMarkdown(prdContent);
    const htmlContent = marked(markdown); // Convert MD to HTML

    const browser = await puppeteer.launch({
        headless: true, // Use new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some environments
    });

    const page = await browser.newPage();

    // Add some basic styling
    const styledHtml = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; line-height: 1.6; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 30px; border-bottom: 1px solid #eee; }
          h3 { color: #777; margin-top: 20px; }
          li { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

    await page.setContent(styledHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px', right: '20px', left: '20px' },
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
};
