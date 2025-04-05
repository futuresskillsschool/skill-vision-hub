
import jsPDF from 'jspdf';

export interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

interface ScoresObj {
  [key: string]: number | string;
}

interface ChartDataItem {
  domain: string;
  score: number;
  fullMark: number;
}

export const generateEQNavigatorPDF = (
  scores: ScoresObj,
  chartData: ChartDataItem[],
  studentDetails: StudentDetails | null
) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  const addStyledText = (
    text: string, 
    x: number, 
    y: number, 
    size: number, 
    style: string = 'normal', 
    align: 'left' | 'center' | 'right' = 'left', 
    color: string = '#000000'
  ) => {
    pdf.setTextColor(color);
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.text(text, x, y, { align });
  };
  
  pdf.setFillColor(255, 245, 230);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setFillColor(255, 230, 200, 0.5);
  pdf.circle(170, 240, 30, 'F');
  
  pdf.setFillColor(255, 210, 170, 0.5);
  pdf.circle(40, 260, 20, 'F');
  
  addStyledText('EQ NAVIGATOR', pageWidth/2, 70, 28, 'bold', 'center', '#F97316');
  addStyledText('ASSESSMENT RESULTS', pageWidth/2, 85, 24, 'bold', 'center', '#F97316');
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  addStyledText(`Report Generated: ${currentDate}`, pageWidth/2, 105, 12, 'italic', 'center', '#555555');
  
  if (studentDetails) {
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'F');
    pdf.setDrawColor(255, 204, 153);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'S');
    
    addStyledText('STUDENT INFORMATION', margin + 10, 135, 14, 'bold', 'left', '#F97316');
    pdf.setLineWidth(0.5);
    pdf.setDrawColor('#F97316');
    pdf.line(margin + 10, 138, margin + 80, 138);
    
    addStyledText('Name:', margin + 10, 155, 12, 'bold', 'left', '#333333');
    addStyledText(studentDetails.name, margin + 50, 155, 12, 'normal', 'left', '#333333');
    
    addStyledText('Class:', margin + 10, 170, 12, 'bold', 'left', '#333333');
    addStyledText(`${studentDetails.class} - ${studentDetails.section}`, margin + 50, 170, 12, 'normal', 'left', '#333333');
    
    addStyledText('School:', margin + 10, 185, 12, 'bold', 'left', '#333333');
    addStyledText(studentDetails.school, margin + 50, 185, 12, 'normal', 'left', '#333333');
  }
  
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'F');
  pdf.setDrawColor(255, 204, 153);
  pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'S');
  
  addStyledText('ABOUT THIS ASSESSMENT', margin + 10, 220, 14, 'bold', 'left', '#F97316');
  pdf.line(margin + 10, 223, margin + 85, 223);
  
  addStyledText('The EQ Navigator Assessment measures key areas of emotional intelligence:', 
    margin + 10, 235, 10, 'normal', 'left', '#333333');
  addStyledText('• Self-Awareness: Understanding your emotions and their impact', 
    margin + 10, 247, 10, 'normal', 'left', '#333333');
  addStyledText('• Self-Regulation: Managing your emotions effectively', 
    margin + 10, 257, 10, 'normal', 'left', '#333333');
  addStyledText('• Social Skills: Building and maintaining relationships', 
    margin + 10, 267, 10, 'normal', 'left', '#333333');
  
  addStyledText('EQ Navigator Assessment Results', pageWidth/2, 285, 9, 'italic', 'center', '#555555');
  addStyledText('Page 1', margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
  
  const addPageHeader = (pageNumber: number) => {
    pdf.setFillColor(255, 245, 230);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    
    addStyledText('EQ Navigator Assessment', margin, 15, 10, 'italic', 'left', '#555555');
    addStyledText('Emotional Intelligence Profile', pageWidth - margin, 15, 12, 'bold', 'right', '#F97316');
    
    pdf.setDrawColor(255, 204, 153);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 20, pageWidth - margin, 20);
    
    addStyledText(`Page ${pageNumber}`, margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
    addStyledText(currentDate, pageWidth - margin, pageHeight - 10, 9, 'normal', 'right', '#555555');
  };
  
  pdf.addPage();
  addPageHeader(2);
  
  let yPosition = 40;
  
  addStyledText('Your EQ Profile', pageWidth/2, yPosition, 18, 'bold', 'center', '#F97316');
  yPosition += 15;
  
  const chartOptions = {
    x: pageWidth / 2,
    y: yPosition + 70,
    width: 150,
    height: 140
  };
  
  const radarChartData = chartData.map(item => ({
    ...item,
    domain: item.domain.replace(/([A-Z])/g, ' $1').trim()
  }));
  
  const centerX = chartOptions.x;
  const centerY = chartOptions.y;
  const radius = Math.min(chartOptions.width, chartOptions.height) / 2;
  
  const angleStep = 360 / radarChartData.length;
  
  radarChartData.forEach((item, index) => {
    const angle = (index * angleStep) - 90;
    const x = centerX + radius * Math.cos(angle * Math.PI / 180);
    const y = centerY + radius * Math.sin(angle * Math.PI / 180);
    
    const labelX = centerX + (radius + 15) * Math.cos(angle * Math.PI / 180);
    const labelY = centerY + (radius + 15) * Math.sin(angle * Math.PI / 180);
    
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(200);
    pdf.line(centerX, centerY, x, y);
    
    pdf.setFillColor(255, 153, 51);
    pdf.circle(x, y, 3, 'F');
    
    pdf.setFontSize(9);
    pdf.setTextColor(50);
    pdf.text(item.domain, labelX, labelY, {
      align: 'center'
    });
  });
  
  pdf.setLineWidth(1);
  pdf.setDrawColor(255, 153, 51);
  pdf.setLineDashPattern([5, 5], 0);
  pdf.circle(centerX, centerY, radius);
  pdf.setLineDashPattern([], 0);
  
  yPosition += chartOptions.height + 30;
  
  addStyledText('Domain Scores', margin, yPosition, 14, 'bold', 'left', '#F97316');
  yPosition += 15;
  
  const domainDescriptions: Record<string, string> = {
    "selfAwareness": "Understanding your own emotions and how they affect your behavior.",
    "selfRegulation": "Managing your emotions and impulses effectively.",
    "motivation": "Using your emotions to achieve goals and persist through challenges.",
    "empathy": "Understanding and sharing the feelings of others.",
    "socialSkills": "Managing relationships and building rapport with others."
  };
  
  Object.entries(scores).forEach(([domain, score], index) => {
    const scoreValue: number = typeof score === 'number' ? score : 0;
    const description = domainDescriptions[domain] || "No description available.";
    
    pdf.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 248 : 242, index % 2 === 0 ? 235 : 230);
    pdf.rect(margin, yPosition, contentWidth, 25, 'F');
    pdf.setDrawColor(255, 204, 153);
    pdf.rect(margin, yPosition, contentWidth, 25, 'S');
    
    addStyledText(domain.replace(/([A-Z])/g, ' $1').trim(), margin + 5, yPosition + 10, 11, 'bold', 'left', '#333333');
    addStyledText(`${scoreValue}/10`, margin + contentWidth - 20, yPosition + 10, 11, 'normal', 'left', '#333333');
    
    pdf.setFillColor(255, 230, 204);
    pdf.roundedRect(margin + 5, yPosition + 15, contentWidth - 10, 6, 3, 3, 'F');
    
    const barWidth = (contentWidth - 10) * (scoreValue / 10);
    pdf.setFillColor(255, 153, 51);
    pdf.roundedRect(margin + 5, yPosition + 15, barWidth, 6, 3, 3, 'F');
    
    yPosition += 30;
  });
  
  pdf.addPage();
  addPageHeader(3);
  
  yPosition = 40;
  
  addStyledText('Understanding Your Scores', margin, yPosition, 14, 'bold', 'left', '#F97316');
  yPosition += 15;
  
  Object.entries(scores).forEach(([domain, score], index) => {
    const scoreValue: number = typeof score === 'number' ? score : 0;
    const description = domainDescriptions[domain] || "No description available.";
    
    pdf.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 248 : 242, index % 2 === 0 ? 235 : 230);
    pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'F');
    pdf.setDrawColor(255, 204, 153);
    pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'S');
    
    addStyledText(domain.replace(/([A-Z])/g, ' $1').trim(), margin + 5, yPosition + 10, 12, 'bold', 'left', '#333333');
    addStyledText(`${scoreValue}/10`, margin + contentWidth - 20, yPosition + 10, 12, 'normal', 'left', '#333333');
    
    const splitDescription = pdf.splitTextToSize(description, contentWidth - 10);
    pdf.text(splitDescription, margin + 5, yPosition + 25);
    
    yPosition += 60;
  });
  
  addStyledText('Note:', margin, yPosition, 10, 'bold', 'left', '#333333');
  const noteText = "These results are based on your self-assessment and provide a snapshot of your emotional intelligence. Consider these insights as a starting point for personal growth and development.";
  
  pdf.setFontSize(9);
  const splitNote = pdf.splitTextToSize(noteText, contentWidth - 20);
  pdf.text(splitNote, margin + 10, yPosition + 15);
  
  return pdf;
};
