using System;
using System.Data.SQLite;
using System.Windows.Forms;

namespace StudentManagement
{
    public partial class frmKhoa : Form
    {
        DBHelper db = new DBHelper();

        public frmKhoa()
        {
            InitializeComponent();
        }

        private void frmKhoa_Load(object sender, EventArgs e)
        {
            LoadData();
        }

        private void LoadData()
        {
            dgvKhoa.DataSource = db.GetData("SELECT * FROM Khoa");
        }

        private void dgvKhoa_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                txtMaKhoa.Text = dgvKhoa.Rows[e.RowIndex].Cells["MaKhoa"].Value.ToString();
                txtTenKhoa.Text = dgvKhoa.Rows[e.RowIndex].Cells["TenKhoa"].Value.ToString();
            }
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            string sql = "INSERT INTO Khoa(MaKhoa, TenKhoa) VALUES(@MaKhoa, @TenKhoa)";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@MaKhoa", int.Parse(txtMaKhoa.Text)),
                new SQLiteParameter("@TenKhoa", txtTenKhoa.Text));
            LoadData();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            string sql = "UPDATE Khoa SET TenKhoa=@TenKhoa WHERE MaKhoa=@MaKhoa";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@TenKhoa", txtTenKhoa.Text),
                new SQLiteParameter("@MaKhoa", int.Parse(txtMaKhoa.Text)));
            LoadData();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            string sql = "DELETE FROM Khoa WHERE MaKhoa=@MaKhoa";
            db.ExecuteNonQuery(sql,
                new SQLiteParameter("@MaKhoa", int.Parse(txtMaKhoa.Text)));
            LoadData();
        }

        private void btnLamMoi_Click(object sender, EventArgs e)
        {
            txtMaKhoa.Clear();
            txtTenKhoa.Clear();
        }
    }
}
