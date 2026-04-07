using System;
using System.Data;
using System.Data.SQLite;
using System.Windows.Forms;

namespace StudentManagement
{
    public partial class frmSinhVien : Form
    {
        DBHelper db = new DBHelper();
        private bool isLoadingFilter;

        public frmSinhVien()
        {
            InitializeComponent();
        }

        private void frmSinhVien_Load(object sender, EventArgs e)
        {
            LoadKhoa();
            LoadFilterKhoa();
            LoadData(null);
        }

        private void LoadKhoa()
        {
            cboKhoa.DataSource = db.GetData("SELECT * FROM Khoa");
            cboKhoa.DisplayMember = "TenKhoa";
            cboKhoa.ValueMember = "MaKhoa";
        }

        private void LoadFilterKhoa()
        {
            isLoadingFilter = true;

            DataTable dt = db.GetData("SELECT MaKhoa, TenKhoa FROM Khoa ORDER BY TenKhoa");
            DataRow allRow = dt.NewRow();
            allRow["MaKhoa"] = DBNull.Value;
            allRow["TenKhoa"] = "Tất cả";
            dt.Rows.InsertAt(allRow, 0);

            cboLocKhoa.DataSource = dt;
            cboLocKhoa.DisplayMember = "TenKhoa";
            cboLocKhoa.ValueMember = "MaKhoa";
            cboLocKhoa.SelectedIndex = 0;

            isLoadingFilter = false;
        }

        private int? GetSelectedFilterKhoa()
        {
            if (cboLocKhoa.SelectedValue == null || cboLocKhoa.SelectedValue == DBNull.Value)
            {
                return null;
            }

            int khoaId;
            if (int.TryParse(cboLocKhoa.SelectedValue.ToString(), out khoaId))
            {
                return khoaId;
            }

            return null;
        }

        private void LoadData(int? maKhoa)
        {
            string sql = @"
                SELECT sv.MaSo, sv.HoTen, sv.NgaySinh, sv.GioiTinh, sv.DiaChi, 
                       sv.DienThoai, sv.MaKhoa, k.TenKhoa
                FROM SinhVien sv
                LEFT JOIN Khoa k ON sv.MaKhoa = k.MaKhoa";

            if (maKhoa.HasValue)
            {
                sql += " WHERE sv.MaKhoa = @MaKhoa";
                dgvSinhVien.DataSource = db.GetData(sql,
                    new SQLiteParameter("@MaKhoa", maKhoa.Value));
            }
            else
            {
                dgvSinhVien.DataSource = db.GetData(sql);
            }
        }

        private void cboLocKhoa_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (isLoadingFilter) return;

            LoadData(GetSelectedFilterKhoa());
        }

        private void dgvSinhVien_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                txtMaSo.Text = dgvSinhVien.Rows[e.RowIndex].Cells["MaSo"].Value.ToString();
                txtHoTen.Text = dgvSinhVien.Rows[e.RowIndex].Cells["HoTen"].Value.ToString();
                dtpNgaySinh.Value = DateTime.Parse(dgvSinhVien.Rows[e.RowIndex].Cells["NgaySinh"].Value.ToString());
                chkGioiTinh.Checked = dgvSinhVien.Rows[e.RowIndex].Cells["GioiTinh"].Value.ToString() == "1";
                txtDiaChi.Text = dgvSinhVien.Rows[e.RowIndex].Cells["DiaChi"].Value.ToString();
                txtDienThoai.Text = dgvSinhVien.Rows[e.RowIndex].Cells["DienThoai"].Value.ToString();
                cboKhoa.SelectedValue = dgvSinhVien.Rows[e.RowIndex].Cells["MaKhoa"].Value;
            }
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            string sql = @"
                INSERT INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa)
                VALUES(@MaSo, @HoTen, @NgaySinh, @GioiTinh, @DiaChi, @DienThoai, @MaKhoa)";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@MaSo", int.Parse(txtMaSo.Text)),
                new SQLiteParameter("@HoTen", txtHoTen.Text),
                new SQLiteParameter("@NgaySinh", dtpNgaySinh.Value.ToString("yyyy-MM-dd")),
                new SQLiteParameter("@GioiTinh", chkGioiTinh.Checked ? 1 : 0),
                new SQLiteParameter("@DiaChi", txtDiaChi.Text),
                new SQLiteParameter("@DienThoai", txtDienThoai.Text),
                new SQLiteParameter("@MaKhoa", cboKhoa.SelectedValue));
            LoadData(GetSelectedFilterKhoa());
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            string sql = @"
                UPDATE SinhVien
                SET HoTen=@HoTen, NgaySinh=@NgaySinh, GioiTinh=@GioiTinh,
                    DiaChi=@DiaChi, DienThoai=@DienThoai, MaKhoa=@MaKhoa
                WHERE MaSo=@MaSo";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@HoTen", txtHoTen.Text),
                new SQLiteParameter("@NgaySinh", dtpNgaySinh.Value.ToString("yyyy-MM-dd")),
                new SQLiteParameter("@GioiTinh", chkGioiTinh.Checked ? 1 : 0),
                new SQLiteParameter("@DiaChi", txtDiaChi.Text),
                new SQLiteParameter("@DienThoai", txtDienThoai.Text),
                new SQLiteParameter("@MaKhoa", cboKhoa.SelectedValue),
                new SQLiteParameter("@MaSo", int.Parse(txtMaSo.Text)));
            LoadData(GetSelectedFilterKhoa());
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            string sql = "DELETE FROM SinhVien WHERE MaSo=@MaSo";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@MaSo", int.Parse(txtMaSo.Text)));
            LoadData(GetSelectedFilterKhoa());
        }
        
        private void btnLamMoi_Click(object sender, EventArgs e)
        {
            txtMaSo.Clear();
            txtHoTen.Clear();
            txtDiaChi.Clear();
            txtDienThoai.Clear();
        }
    }
}
