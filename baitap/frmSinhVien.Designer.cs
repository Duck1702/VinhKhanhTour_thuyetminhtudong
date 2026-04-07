namespace StudentManagement
{
    partial class frmSinhVien
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null)) components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.lblMaSo = new System.Windows.Forms.Label();
            this.txtMaSo = new System.Windows.Forms.TextBox();
            this.lblHoTen = new System.Windows.Forms.Label();
            this.txtHoTen = new System.Windows.Forms.TextBox();
            this.lblNgaySinh = new System.Windows.Forms.Label();
            this.dtpNgaySinh = new System.Windows.Forms.DateTimePicker();
            this.chkGioiTinh = new System.Windows.Forms.CheckBox();
            this.lblDiaChi = new System.Windows.Forms.Label();
            this.txtDiaChi = new System.Windows.Forms.TextBox();
            this.lblDienThoai = new System.Windows.Forms.Label();
            this.txtDienThoai = new System.Windows.Forms.TextBox();
            this.lblKhoa = new System.Windows.Forms.Label();
            this.cboKhoa = new System.Windows.Forms.ComboBox();
            this.btnThem = new System.Windows.Forms.Button();
            this.btnSua = new System.Windows.Forms.Button();
            this.btnXoa = new System.Windows.Forms.Button();
            this.btnLamMoi = new System.Windows.Forms.Button();
            this.lblLocKhoa = new System.Windows.Forms.Label();
            this.cboLocKhoa = new System.Windows.Forms.ComboBox();
            this.dgvSinhVien = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.dgvSinhVien)).BeginInit();
            this.SuspendLayout();
            
            // Labels & Inputs
            this.lblMaSo.Location = new System.Drawing.Point(20, 20);
            this.lblMaSo.Text = "Mã số:";
            this.txtMaSo.Location = new System.Drawing.Point(90, 17);
            
            this.lblHoTen.Location = new System.Drawing.Point(20, 50);
            this.lblHoTen.Text = "Họ tên:";
            this.txtHoTen.Location = new System.Drawing.Point(90, 47);
            
            this.lblNgaySinh.Location = new System.Drawing.Point(20, 80);
            this.lblNgaySinh.Text = "Ngày sinh:";
            this.dtpNgaySinh.Location = new System.Drawing.Point(90, 77);
            this.dtpNgaySinh.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            
            this.chkGioiTinh.Location = new System.Drawing.Point(90, 107);
            this.chkGioiTinh.Text = "Nam";
            
            this.lblDiaChi.Location = new System.Drawing.Point(250, 20);
            this.lblDiaChi.Text = "Địa chỉ:";
            this.txtDiaChi.Location = new System.Drawing.Point(320, 17);
            
            this.lblDienThoai.Location = new System.Drawing.Point(250, 50);
            this.lblDienThoai.Text = "Điện thoại:";
            this.txtDienThoai.Location = new System.Drawing.Point(320, 47);
            
            this.lblKhoa.Location = new System.Drawing.Point(250, 80);
            this.lblKhoa.Text = "Khoa:";
            this.cboKhoa.Location = new System.Drawing.Point(320, 77);
            this.cboKhoa.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            
            // Buttons
            this.btnThem.Location = new System.Drawing.Point(500, 15);
            this.btnThem.Text = "Thêm";
            this.btnThem.Click += new System.EventHandler(this.btnThem_Click);
            
            this.btnSua.Location = new System.Drawing.Point(500, 45);
            this.btnSua.Text = "Sửa";
            this.btnSua.Click += new System.EventHandler(this.btnSua_Click);
            
            this.btnXoa.Location = new System.Drawing.Point(500, 75);
            this.btnXoa.Text = "Xóa";
            this.btnXoa.Click += new System.EventHandler(this.btnXoa_Click);
            
            this.btnLamMoi.Location = new System.Drawing.Point(500, 105);
            this.btnLamMoi.Text = "Làm mới";
            this.btnLamMoi.Click += new System.EventHandler(this.btnLamMoi_Click);

            // Filter by department
            this.lblLocKhoa.Location = new System.Drawing.Point(20, 114);
            this.lblLocKhoa.Size = new System.Drawing.Size(64, 20);
            this.lblLocKhoa.Text = "Lọc khoa:";

            this.cboLocKhoa.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboLocKhoa.Location = new System.Drawing.Point(90, 111);
            this.cboLocKhoa.Size = new System.Drawing.Size(180, 21);
            this.cboLocKhoa.SelectedIndexChanged += new System.EventHandler(this.cboLocKhoa_SelectedIndexChanged);
            
            // DataGridView
            this.dgvSinhVien.Location = new System.Drawing.Point(20, 145);
            this.dgvSinhVien.Size = new System.Drawing.Size(650, 240);
            this.dgvSinhVien.AllowUserToAddRows = false;
            this.dgvSinhVien.ReadOnly = true;
            this.dgvSinhVien.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvSinhVien_CellClick);
            
            this.ClientSize = new System.Drawing.Size(700, 410);
            this.Controls.Add(this.dgvSinhVien);
            this.Controls.Add(this.cboLocKhoa);
            this.Controls.Add(this.lblLocKhoa);
            this.Controls.Add(this.btnLamMoi);
            this.Controls.Add(this.btnXoa);
            this.Controls.Add(this.btnSua);
            this.Controls.Add(this.btnThem);
            this.Controls.Add(this.cboKhoa);
            this.Controls.Add(this.lblKhoa);
            this.Controls.Add(this.txtDienThoai);
            this.Controls.Add(this.lblDienThoai);
            this.Controls.Add(this.txtDiaChi);
            this.Controls.Add(this.lblDiaChi);
            this.Controls.Add(this.chkGioiTinh);
            this.Controls.Add(this.dtpNgaySinh);
            this.Controls.Add(this.lblNgaySinh);
            this.Controls.Add(this.txtHoTen);
            this.Controls.Add(this.lblHoTen);
            this.Controls.Add(this.txtMaSo);
            this.Controls.Add(this.lblMaSo);
            this.Name = "frmSinhVien";
            this.Text = "Thông tin sinh viên";
            this.Load += new System.EventHandler(this.frmSinhVien_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvSinhVien)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private System.Windows.Forms.Label lblMaSo;
        private System.Windows.Forms.TextBox txtMaSo;
        private System.Windows.Forms.Label lblHoTen;
        private System.Windows.Forms.TextBox txtHoTen;
        private System.Windows.Forms.Label lblNgaySinh;
        private System.Windows.Forms.DateTimePicker dtpNgaySinh;
        private System.Windows.Forms.CheckBox chkGioiTinh;
        private System.Windows.Forms.Label lblDiaChi;
        private System.Windows.Forms.TextBox txtDiaChi;
        private System.Windows.Forms.Label lblDienThoai;
        private System.Windows.Forms.TextBox txtDienThoai;
        private System.Windows.Forms.Label lblKhoa;
        private System.Windows.Forms.ComboBox cboKhoa;
        private System.Windows.Forms.Button btnThem;
        private System.Windows.Forms.Button btnSua;
        private System.Windows.Forms.Button btnXoa;
        private System.Windows.Forms.Button btnLamMoi;
        private System.Windows.Forms.Label lblLocKhoa;
        private System.Windows.Forms.ComboBox cboLocKhoa;
        private System.Windows.Forms.DataGridView dgvSinhVien;
    }
}
