using System;
using System.Drawing;
using System.Windows.Forms;

namespace StudentManagement
{
    public class frmWelcome : Form
    {
        private readonly DBHelper db = new DBHelper();
        private readonly Timer clockTimer = new Timer();
        private readonly Label lblClock = new Label();
        private readonly Label lblSV = new Label();
        private readonly Label lblKhoa = new Label();
        private readonly Label lblMon = new Label();
        private readonly Label lblDiem = new Label();

        public frmWelcome()
        {
            BuildUi();
            Load += frmWelcome_Load;
        }

        private void frmWelcome_Load(object sender, EventArgs e)
        {
            RefreshStats();
            clockTimer.Interval = 1000;
            clockTimer.Tick += (s, args) =>
            {
                lblClock.Text = DateTime.Now.ToString("dddd, dd/MM/yyyy  HH:mm:ss");
                if (DateTime.Now.Second % 15 == 0)
                {
                    RefreshStats();
                }
            };
            clockTimer.Start();
        }

        private void BuildUi()
        {
            Text = "Trang chu";
            BackColor = Color.FromArgb(244, 248, 255);
            StartPosition = FormStartPosition.CenterScreen;
            WindowState = FormWindowState.Maximized;

            // Hidden child-frame decorations for cleaner MDI look.
            FormBorderStyle = FormBorderStyle.None;
            ControlBox = false;
            MaximizeBox = false;
            MinimizeBox = false;

            Panel header = new Panel
            {
                Dock = DockStyle.Top,
                Height = 130,
                BackColor = Color.FromArgb(29, 78, 216)
            };

            PictureBox pb = new PictureBox
            {
                Size = new Size(64, 64),
                Location = new Point(24, 30),
                SizeMode = PictureBoxSizeMode.StretchImage,
                Image = SystemIcons.Information.ToBitmap()
            };

            Label lblTitle = new Label
            {
                AutoSize = true,
                Location = new Point(104, 26),
                Font = new Font("Segoe UI", 20F, FontStyle.Bold),
                ForeColor = Color.White,
                Text = "STUDENT MANAGEMENT"
            };

            Label lblSub = new Label
            {
                AutoSize = true,
                Location = new Point(108, 72),
                Font = new Font("Segoe UI", 10F, FontStyle.Regular),
                ForeColor = Color.FromArgb(219, 234, 254),
                Text = "He thong quan ly sinh vien - SQLite"
            };

            lblClock.AutoSize = true;
            lblClock.Location = new Point(700, 54);
            lblClock.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            lblClock.ForeColor = Color.FromArgb(191, 219, 254);

            header.Controls.Add(pb);
            header.Controls.Add(lblTitle);
            header.Controls.Add(lblSub);
            header.Controls.Add(lblClock);
            Controls.Add(header);

            FlowLayoutPanel cards = new FlowLayoutPanel
            {
                Dock = DockStyle.Top,
                Height = 180,
                Padding = new Padding(24, 24, 24, 12),
                FlowDirection = FlowDirection.LeftToRight,
                WrapContents = false
            };

            cards.Controls.Add(CreateCard("Sinh vien", lblSV, Color.FromArgb(16, 185, 129)));
            cards.Controls.Add(CreateCard("Khoa", lblKhoa, Color.FromArgb(59, 130, 246)));
            cards.Controls.Add(CreateCard("Mon hoc", lblMon, Color.FromArgb(245, 158, 11)));
            cards.Controls.Add(CreateCard("Bang diem", lblDiem, Color.FromArgb(239, 68, 68)));
            Controls.Add(cards);

            Panel tips = new Panel
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(24),
                BackColor = Color.FromArgb(244, 248, 255)
            };

            Label lblGuide = new Label
            {
                Dock = DockStyle.Fill,
                Font = new Font("Segoe UI", 11F),
                ForeColor = Color.FromArgb(30, 41, 59),
                Text =
                    "Huong dan nhanh:\r\n" +
                    "- Quan ly > Sinh vien: Them / Sua / Xoa sinh vien\r\n" +
                    "- Quan ly > Mon hoc, Khoa: Quan tri danh muc\r\n" +
                    "- Diem > Nhap diem: Cap nhat bang KetQua\r\n" +
                    "- Tra cuu > Xem diem / SV theo khoa: Bao cao nhanh\r\n\r\n" +
                    "Meo: Du lieu mau da duoc seed san de ban test ngay.",
            };

            tips.Controls.Add(lblGuide);
            Controls.Add(tips);
        }

        private Panel CreateCard(string title, Label valueLabel, Color accent)
        {
            Panel p = new Panel
            {
                Width = 250,
                Height = 130,
                Margin = new Padding(0, 0, 16, 0),
                BackColor = Color.White
            };

            Panel line = new Panel
            {
                Dock = DockStyle.Top,
                Height = 6,
                BackColor = accent
            };

            Label lblTitle = new Label
            {
                AutoSize = true,
                Location = new Point(16, 24),
                Font = new Font("Segoe UI", 10F, FontStyle.Bold),
                ForeColor = Color.FromArgb(71, 85, 105),
                Text = title
            };

            valueLabel.AutoSize = true;
            valueLabel.Location = new Point(16, 58);
            valueLabel.Font = new Font("Segoe UI", 24F, FontStyle.Bold);
            valueLabel.ForeColor = accent;
            valueLabel.Text = "0";

            p.Controls.Add(line);
            p.Controls.Add(lblTitle);
            p.Controls.Add(valueLabel);
            return p;
        }

        private void RefreshStats()
        {
            lblSV.Text = ReadCount("SELECT COUNT(1) FROM SinhVien");
            lblKhoa.Text = ReadCount("SELECT COUNT(1) FROM Khoa");
            lblMon.Text = ReadCount("SELECT COUNT(1) FROM Mon");
            lblDiem.Text = ReadCount("SELECT COUNT(1) FROM KetQua");
        }

        private string ReadCount(string sql)
        {
            object result = db.ExecuteScalar(sql);
            if (result == null || result == DBNull.Value)
            {
                return "0";
            }

            return Convert.ToString(result);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                clockTimer.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}
