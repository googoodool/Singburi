import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../assets/logo.png";
import "../assets/Sarabun-Regular-normal";
import "../assets/Sarabun-Light-normal";
import "../assets/Prompt-Regular-normal";
import config from "../assets/NameStation";

const testClick = (data) => {
  // console.log(data.data.Date);
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
  var dateTime = date + "-" + time;

  // แก้ store ให้เป็นแบบเดียวกัน
  let overImg = "data:image/png;base64," + data.data.img_overview;
  let lprImg = "data:image/png;base64," + data.data.img_lpr;

  let statusText = "ไม่เกินกฎหมาย";
  if (data.data.gross > data.data.max_weight) {
    statusText = "เกินพิกัดกฎหมาย";
  }

  let space_w1 = (data.data.space_w1 * 0.1).toFixed(1);
  let space_w2 = 0;
  let space_w3 = 0;
  let space_w4 = 0;
  let space_w5 = 0;
  let space_w6 = 0;
  if (data.data.space_w2 !== "-") {
    space_w2 = (data.data.space_w2 * 0.1).toFixed(1);
    if (space_w2 < 1) {
      space_w2 = "-";
    }
  } else {
    space_w2 = "-";
  }
  if (data.data.space_w3 !== "-") {
    space_w3 = (data.data.space_w3 * 0.1).toFixed(1);
    if (space_w3 < 1) {
      space_w3 = "-";
    }
  } else {
    space_w3 = "-";
  }
  if (data.data.space_w4 !== "-") {
    space_w4 = (data.data.space_w4 * 0.1).toFixed(1);
    if (space_w4 < 1) {
      space_w4 = "-";
    }
  } else {
    space_w4 = "-";
  }
  if (data.data.space_w5 !== "-") {
    space_w5 = (data.data.space_w5 * 0.1).toFixed(1);
    if (space_w5 < 1) {
      space_w5 = "-";
    }
  } else {
    space_w5 = "-";
  }
  if (data.data.space_w6 !== "-") {
    space_w6 = (data.data.space_w6 * 0.1).toFixed(1);
    if (space_w6 < 1) {
      space_w6 = "-";
    }
  } else {
    space_w6 = "-";
  }

  if (data.data.sum_w3 === "0") {
    data.data.sum_w3 = "-";
  }
  if (data.data.sum_w4 === "0") {
    data.data.sum_w4 = "-";
  }
  if (data.data.sum_w5 === "0") {
    data.data.sum_w5 = "-";
  }
  if (data.data.sum_w6 === "0") {
    data.data.sum_w6 = "-";
  }
  if (data.data.sum_w7 === "0") {
    data.data.sum_w7 = "-";
  }

  const doc = new jsPDF();

  // Header
  doc.addImage(Logo, "PNG", 180, 8, 17, 17); // Add your logo image
  doc.setFont("Sarabun-Regular");
  doc.setFontSize(10);
  doc.setTextColor("#77787B");
  doc.text("รายงานตรวจสอบนำ้หนักรถบรรทุก โดยระบบ WEIGHT IN MOTION", 15, 14);
  doc.text("สำนักงานควบคุมนำ้หนักยานพาหนะ กรมทางหลวง", 15, 19); // Add your header text
  doc.text("สถานีตรวจสอบนำ้หนัก " + config.nameStation, 15, 24);
  doc.setLineWidth(0.7);
  doc.line(15, 28, 197, 28);
  doc.setLineWidth(0.3);
  doc.line(15, 29, 197, 29);

  doc.setFont("Prompt-Regular");
  doc.setFontSize(11);
  doc.setTextColor("#00000");
  doc.text("ภาพถ่ายรถบรรทุก", 105, 42, "center");
  doc.setFontSize(10);
  doc.text("Overview", 50, 53);
  doc.text("LPR", 145, 53);

  doc.addImage(overImg, "PNG", 15, 57, 85, 55);
  doc.addImage(lprImg, "PNG", 110, 57, 85, 55);

  doc.text("ข้อมูลรถบรรทุกจากระบบ WIM", 83, 130);

  autoTable(doc, {
    startY: 140,
    didParseCell: function (data) {
      var cell = data.cell;
      cell.styles.font = "Sarabun-Regular";
    },
    head: [["รายการ", "ข้อมูลจากระบบ WIM", "รายการ", "ข้อมูลจากระบบ WIM"]],
    body: [
      [
        "วันที่",
        data.data.date_update.substring(0, 10),
        "เวลา",
        data.data.time_update.substring(11, 19),
      ],
      [
        "ช่องจราจร",
        "เลน " + data.data.lane,
        "ความเร็ว",
        Math.round(data.data.speed * 0.1) + " Km/H",
      ],
      [
        "ประเภทรถ",
        data.data.legal_class + " - " + data.data.class_detail,
        "ป้ายทะเบียน",
        data.data.lpr_number + " " + data.data.province,
      ],
      ["จํานวนเพลา", data.data.sum_axle + " เพลา", "สถานะ", statusText],
      [
        "น้ําหนักพิกัดกฎหมาย",
        data.data.max_weight + " Kg",
        "ESAL Flexible",
        data.data.flex.toFixed(2),
      ],
      [
        "น้ําหนักรถบรรทุก",
        data.data.gross + " Kg",
        "ESAL Rigid10 / Rigid11",
        data.data.rigid10.toFixed(2) + " / " + data.data.rigid11.toFixed(2),
      ],
    ],
  });

  doc.text("ตารางแสดงข้อมูลเพลารถบรรทุก", 83, 208);

  autoTable(doc, {
    startY: 215,

    didParseCell: function (data) {
      var cell = data.cell;
      cell.styles.font = "Sarabun-Regular";
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 19 },
      7: { cellWidth: 19 },
    },
    head: [["เพลา", "1", "2", "3", "4", "5", "6", "7"]],
    body: [
      [
        "น้ําหนักเพลา (Kg)",
        data.data.sum_w1,
        data.data.sum_w2,
        data.data.sum_w3,
        data.data.sum_w4,
        data.data.sum_w5,
        data.data.sum_w6,
        data.data.sum_w7,
      ],
    ],
  });

  autoTable(doc, {
    startY: 240,
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 19 },
      7: { cellWidth: 19 },
    },
    didParseCell: function (data) {
      var cell = data.cell;
      cell.styles.font = "Sarabun-Regular";
    },

    head: [["เพลา", "1", "2", "3", "4", "5", "6", "7"]],
    body: [
      [
        "ระยะห่างระหว่างเพลา (m)",
        space_w1,
        space_w2,
        space_w3,
        space_w4,
        space_w5,
        space_w6,
        "-",
      ],
    ],
  });

  doc.save("Report " + dateTime + ".pdf");
};

function PDFdetail({ buttonText, data, variant, color }) {
  return (
    <Button onClick={() => testClick({ data })} variant={variant} color={color}>
      {buttonText}
    </Button>
  );
}
export default PDFdetail;
