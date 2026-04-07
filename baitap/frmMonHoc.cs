using System;
using System.Data.SQLite;
using System.Windows.Forms;

namespace StudentManagement
{
    public partial class frmMonHoc : Form
    {
        DBHelper db = new DBHelper();

        public frmMonHoc()
        {
            InitializeComponent();
        }

        private void frmMonHoc_Load(object sender, EventArgs e)
        {
            LoadData();
        }

        private void LoadData()
        {
            dgvMonHoc.DataSource = db.GetData("SELECT * FROM Mon");
        }

        private void dgvMonHoc_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                txtMaMH.Text = dgvMonHoc.Rows[e.RowIndex].Cells["MaMH"].Value.ToString();
                txtTenMH.Text = dgvMonHoc.Rows[e.RowIndex].Cells["TenMH"].Value.ToString();
                txtSoTiet.Text = dgvMonHoc.Rows[e.RowIndex].Cells["SoTiet"].Value.ToString();
            }
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            string sql = "INSERT INTO Mon(MaMH, TenMH, SoTiet) VALUES(@MaMH, @TenMH, @SoTiet)";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@MaMH", int.Parse(txtMaMH.Text)),
                new SQLiteParameter("@TenMH", txtTenMH.Text),
                new SQLiteParameter("@SoTiet", int.Parse(txtSoTiet.Text)));
            LoadData();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            string sql = "UPDATE Mon SET TenMH=@TenMH, SoTiet=@SoTiet WHERE MaMH=@MaMH";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@TenMH", txtTenMH.Text),
                new SQLiteParameter("@SoTiet", int.Parse(txtSoTiet.Text)),
                new SQLiteParameter("@MaMH", int.Parse(txtMaMH.Text)));
            LoadData();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            string sql = "DELETE FROM Mon WHERE MaMH=@MaMH";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@MaMH", int.Parse(txtMaMH.Text)));
            LoadData();
        }
        
        private void btnLamMoi_Click(object sender, EventArgs e)
        {
            txtMaMH.Clear();
            txtTenMH.Clear();
            txtSoTiet.Clear();
        }
    }
}
