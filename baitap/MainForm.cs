using System;
using System.Drawing;
using System.Windows.Forms;

namespace StudentManagement
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
            this.IsMdiContainer = true;
            this.WindowState = FormWindowState.Maximized;
            SetupToolbarIcons();
        }

        private void SetupToolbarIcons()
        {
            btnSinhVien.Image = SystemIcons.Information.ToBitmap();
            btnKhoa.Image = SystemIcons.Application.ToBitmap();
            btnMonHoc.Image = SystemIcons.Asterisk.ToBitmap();
            btnNhapDiem.Image = SystemIcons.Shield.ToBitmap();
            btnXemDiem.Image = SystemIcons.Question.ToBitmap();
            btnThongKeKhoa.Image = SystemIcons.WinLogo.ToBitmap();
            btnThoat.Image = SystemIcons.Error.ToBitmap();
        }

        private void OpenChildForm(Form frm)
        {
            foreach (Form child in this.MdiChildren)
            {
                if (child.GetType() == frm.GetType())
                {
                    child.Activate();
                    return;
                }
            }

            frm.MdiParent = this;
            frm.Show();
        }

        private void mnuKhoa_Click(object sender, EventArgs e)
        {
            OpenChildForm(new frmKhoa());
        }

        private void mnuMonHoc_Click(object sender, EventArgs e)
        {
            OpenChildForm(new frmMonHoc());
        }

        private void mnuSinhVien_Click(object sender, EventArgs e)
        {
            OpenChildForm(new frmSinhVien());
        }

        private void mnuNhapDiem_Click(object sender, EventArgs e)
        {
            OpenChildForm(new frmNhapDiem());
        }

        private void mnuXemDiem_Click(object sender, EventArgs e)
        {
            OpenChildForm(new frmXemDiem());
        }

        private void mnuSVTheoKhoa_Click(object sender, EventArgs e)
        {
            OpenChildForm(new frmSinhVienTheoKhoa());
        }

        private void mnuGioiThieu_Click(object sender, EventArgs e)
        {
            MessageBox.Show(
                "QLSV\nVersion 1.0.0.0\nCopyright © 2008 - Nguyễn Hà Giang\n\nPhiên bản demo phục vụ học tập.",
                "About QLSV",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }
    }
}
