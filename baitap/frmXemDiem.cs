using System;
using System.Data;
using System.Data.SQLite;
using System.Windows.Forms;

namespace StudentManagement
{
    public partial class frmXemDiem : Form
    {
        DBHelper db = new DBHelper();
        private bool isLoading;

        public frmXemDiem()
        {
            InitializeComponent();
        }

        private void frmXemDiem_Load(object sender, EventArgs e)
        {
            isLoading = true;

            DataTable dtMaSo = db.GetData("SELECT MaSo FROM SinhVien ORDER BY MaSo");
            cboMaSo.DataSource = dtMaSo;
            cboMaSo.DisplayMember = "MaSo";
            cboMaSo.ValueMember = "MaSo";

            isLoading = false;

            if (cboMaSo.Items.Count > 0)
            {
                cboMaSo.SelectedIndex = 0;
                UpdateThongTinSinhVien();
            }
        }

        private void cboMaSo_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (isLoading) return;
            UpdateThongTinSinhVien();
        }

        private void cboMaSo_TextChanged(object sender, EventArgs e)
        {
            if (isLoading) return;
            UpdateThongTinSinhVien();
        }

        private bool TryGetMaSo(out int maSo)
        {
            maSo = 0;

            if (cboMaSo.SelectedValue != null && int.TryParse(cboMaSo.SelectedValue.ToString(), out maSo))
            {
                return true;
            }

            return int.TryParse(cboMaSo.Text.Trim(), out maSo);
        }

        private void UpdateThongTinSinhVien()
        {
            int maSo;
            if (!TryGetMaSo(out maSo))
            {
                txtHoTen.Clear();
                txtKhoa.Clear();
                dgvXemDiem.DataSource = null;
                return;
            }

            DataTable dt = db.GetData(@"
                SELECT sv.HoTen, k.TenKhoa
                FROM SinhVien sv
                LEFT JOIN Khoa k ON sv.MaKhoa = k.MaKhoa
                WHERE sv.MaSo = @MaSo",
                new SQLiteParameter("@MaSo", maSo));

            if (dt.Rows.Count == 0)
            {
                txtHoTen.Clear();
                txtKhoa.Clear();
                dgvXemDiem.DataSource = null;
                return;
            }

            txtHoTen.Text = dt.Rows[0]["HoTen"].ToString();
            txtKhoa.Text = dt.Rows[0]["TenKhoa"].ToString();
        }

        private void btnXem_Click(object sender, EventArgs e)
        {
            int maSo;
            if (!TryGetMaSo(out maSo)) return;

            string sql = @"
                SELECT m.TenMH, kq.Diem
                FROM KetQua kq
                JOIN Mon m ON kq.MaMH = m.MaMH
                WHERE kq.MaSo = @MaSo";

            dgvXemDiem.DataSource = db.GetData(sql,
                new SQLiteParameter("@MaSo", maSo));
        }
    }
}
