using System;
using System.Data.SQLite;
using System.Windows.Forms;

namespace StudentManagement
{
    public partial class frmNhapDiem : Form
    {
        DBHelper db = new DBHelper();
        private bool isSyncing;

        public frmNhapDiem()
        {
            InitializeComponent();
        }

        private void frmNhapDiem_Load(object sender, EventArgs e)
        {
            LoadSinhVien();
            LoadMonHoc();
            LoadData();
        }

        private void LoadSinhVien()
        {
            var dt = db.GetData("SELECT MaSo, HoTen FROM SinhVien ORDER BY MaSo");

            cboMaSo.DataSource = dt.Copy();
            cboMaSo.DisplayMember = "MaSo";
            cboMaSo.ValueMember = "MaSo";

            cboHoTen.DataSource = dt;
            cboHoTen.DisplayMember = "HoTen";
            cboHoTen.ValueMember = "MaSo";
        }

        private void LoadMonHoc()
        {
            var dt = db.GetData("SELECT MaMH, TenMH FROM Mon ORDER BY MaMH");

            cboMaMH.DataSource = dt.Copy();
            cboMaMH.DisplayMember = "MaMH";
            cboMaMH.ValueMember = "MaMH";

            cboTenMH.DataSource = dt;
            cboTenMH.DisplayMember = "TenMH";
            cboTenMH.ValueMember = "MaMH";
        }

        private void LoadData()
        {
            string sql = @"
                SELECT kq.MaSo, sv.HoTen, kq.MaMH, m.TenMH, kq.Diem
                FROM KetQua kq
                JOIN SinhVien sv ON kq.MaSo = sv.MaSo
                JOIN Mon m ON kq.MaMH = m.MaMH";
            dgvDiem.DataSource = db.GetData(sql);
        }
        
        private void dgvDiem_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                cboMaSo.SelectedValue = dgvDiem.Rows[e.RowIndex].Cells["MaSo"].Value;
                cboMaMH.SelectedValue = dgvDiem.Rows[e.RowIndex].Cells["MaMH"].Value;
                txtDiem.Text = dgvDiem.Rows[e.RowIndex].Cells["Diem"].Value.ToString();
            }
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            string sql = "INSERT INTO KetQua(MaSo, MaMH, Diem) VALUES(@MaSo, @MaMH, @Diem)";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@MaSo", cboMaSo.SelectedValue),
                new SQLiteParameter("@MaMH", cboMaMH.SelectedValue),
                new SQLiteParameter("@Diem", double.Parse(txtDiem.Text)));
            LoadData();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            string sql = "UPDATE KetQua SET Diem=@Diem WHERE MaSo=@MaSo AND MaMH=@MaMH";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@Diem", double.Parse(txtDiem.Text)),
                new SQLiteParameter("@MaSo", cboMaSo.SelectedValue),
                new SQLiteParameter("@MaMH", cboMaMH.SelectedValue));
            LoadData();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            string sql = "DELETE FROM KetQua WHERE MaSo=@MaSo AND MaMH=@MaMH";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@MaSo", cboMaSo.SelectedValue),
                new SQLiteParameter("@MaMH", cboMaMH.SelectedValue));
            LoadData();
        }

        private void btnLamMoi_Click(object sender, EventArgs e)
        {
            txtDiem.Clear();
        }

        private void cboMaSo_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (isSyncing) return;
            isSyncing = true;
            cboHoTen.SelectedValue = cboMaSo.SelectedValue;
            isSyncing = false;
        }

        private void cboHoTen_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (isSyncing) return;
            isSyncing = true;
            cboMaSo.SelectedValue = cboHoTen.SelectedValue;
            isSyncing = false;
        }

        private void cboMaMH_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (isSyncing) return;
            isSyncing = true;
            cboTenMH.SelectedValue = cboMaMH.SelectedValue;
            isSyncing = false;
        }

        private void cboTenMH_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (isSyncing) return;
            isSyncing = true;
            cboMaMH.SelectedValue = cboTenMH.SelectedValue;
            isSyncing = false;
        }
    }
}
