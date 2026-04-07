using System;
using System.Data.SQLite;
using System.Windows.Forms;

namespace StudentManagement
{
    public partial class frmSinhVienTheoKhoa : Form
    {
        DBHelper db = new DBHelper();
        private bool isSyncing;
        private bool isLoading;

        public frmSinhVienTheoKhoa()
        {
            InitializeComponent();
        }

        private void frmSinhVienTheoKhoa_Load(object sender, EventArgs e)
        {
            isLoading = true;

            var dt = db.GetData("SELECT MaKhoa, TenKhoa FROM Khoa ORDER BY MaKhoa");

            cboMaKhoa.DataSource = dt.Copy();
            cboMaKhoa.DisplayMember = "MaKhoa";
            cboMaKhoa.ValueMember = "MaKhoa";

            cboTenKhoa.DataSource = dt.Copy();
            cboTenKhoa.DisplayMember = "TenKhoa";
            cboTenKhoa.ValueMember = "MaKhoa";

            isLoading = false;

            if (cboMaKhoa.Items.Count > 0)
            {
                cboMaKhoa.SelectedIndex = 0;
                LoadSinhVienTheoKhoa();
            }
        }

        private void btnXem_Click(object sender, EventArgs e)
        {
            LoadSinhVienTheoKhoa();
        }

        private void LoadSinhVienTheoKhoa()
        {
            if (cboMaKhoa.SelectedValue == null)
            {
                return;
            }

            int maKhoa;
            if (!int.TryParse(cboMaKhoa.SelectedValue.ToString(), out maKhoa))
            {
                return;
            }

            string sql = @"
                SELECT MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai
                FROM SinhVien
                WHERE MaKhoa = @MaKhoa";

            dgvSVTheoKhoa.DataSource = db.GetData(sql,
                new SQLiteParameter("@MaKhoa", maKhoa));
        }

        private void cboMaKhoa_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (isLoading || isSyncing || cboMaKhoa.SelectedIndex < 0) return;

            try
            {
                isSyncing = true;
                cboTenKhoa.SelectedIndex = cboMaKhoa.SelectedIndex;
            }
            finally
            {
                isSyncing = false;
            }

            LoadSinhVienTheoKhoa();
        }

        private void cboTenKhoa_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (isLoading || isSyncing || cboTenKhoa.SelectedIndex < 0) return;

            try
            {
                isSyncing = true;
                cboMaKhoa.SelectedIndex = cboTenKhoa.SelectedIndex;
            }
            finally
            {
                isSyncing = false;
            }

            LoadSinhVienTheoKhoa();
        }
    }
}
