namespace StudentManagement
{
    partial class frmNhapDiem
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
            this.cboMaSo = new System.Windows.Forms.ComboBox();
            this.lblHoTen = new System.Windows.Forms.Label();
            this.cboHoTen = new System.Windows.Forms.ComboBox();
            this.lblMaMH = new System.Windows.Forms.Label();
            this.cboMaMH = new System.Windows.Forms.ComboBox();
            this.lblTenMH = new System.Windows.Forms.Label();
            this.cboTenMH = new System.Windows.Forms.ComboBox();
            this.lblDiem = new System.Windows.Forms.Label();
            this.txtDiem = new System.Windows.Forms.TextBox();
            this.btnThem = new System.Windows.Forms.Button();
            this.btnSua = new System.Windows.Forms.Button();
            this.btnXoa = new System.Windows.Forms.Button();
            this.btnLamMoi = new System.Windows.Forms.Button();
            this.dgvDiem = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.dgvDiem)).BeginInit();
            this.SuspendLayout();
            
            this.lblMaSo.Location = new System.Drawing.Point(30, 30);
            this.lblMaSo.Text = "Mã số:";
            this.cboMaSo.Location = new System.Drawing.Point(100, 27);
            this.cboMaSo.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboMaSo.SelectedIndexChanged += new System.EventHandler(this.cboMaSo_SelectedIndexChanged);

            this.lblHoTen.Location = new System.Drawing.Point(30, 65);
            this.lblHoTen.Text = "Họ tên:";
            this.cboHoTen.Location = new System.Drawing.Point(100, 62);
            this.cboHoTen.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboHoTen.SelectedIndexChanged += new System.EventHandler(this.cboHoTen_SelectedIndexChanged);

            this.lblMaMH.Location = new System.Drawing.Point(30, 100);
            this.lblMaMH.Text = "Mã môn:";
            this.cboMaMH.Location = new System.Drawing.Point(100, 97);
            this.cboMaMH.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboMaMH.SelectedIndexChanged += new System.EventHandler(this.cboMaMH_SelectedIndexChanged);

            this.lblTenMH.Location = new System.Drawing.Point(30, 135);
            this.lblTenMH.Text = "Tên môn:";
            this.cboTenMH.Location = new System.Drawing.Point(100, 132);
            this.cboTenMH.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboTenMH.SelectedIndexChanged += new System.EventHandler(this.cboTenMH_SelectedIndexChanged);
            
            this.lblDiem.Location = new System.Drawing.Point(30, 170);
            this.lblDiem.Text = "Điểm:";
            this.txtDiem.Location = new System.Drawing.Point(100, 167);
            
            this.btnThem.Location = new System.Drawing.Point(280, 25);
            this.btnThem.Text = "Lưu Điểm";
            this.btnThem.Click += new System.EventHandler(this.btnThem_Click);
            
            this.btnSua.Location = new System.Drawing.Point(280, 65);
            this.btnSua.Text = "Cập nhật";
            this.btnSua.Click += new System.EventHandler(this.btnSua_Click);
            
            this.btnXoa.Location = new System.Drawing.Point(370, 25);
            this.btnXoa.Text = "Xóa";
            this.btnXoa.Click += new System.EventHandler(this.btnXoa_Click);
            
            this.btnLamMoi.Location = new System.Drawing.Point(370, 65);
            this.btnLamMoi.Text = "Làm mới";
            this.btnLamMoi.Click += new System.EventHandler(this.btnLamMoi_Click);
            
            this.dgvDiem.Location = new System.Drawing.Point(30, 210);
            this.dgvDiem.Size = new System.Drawing.Size(465, 200);
            this.dgvDiem.AllowUserToAddRows = false;
            this.dgvDiem.ReadOnly = true;
            this.dgvDiem.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvDiem_CellClick);
            
            this.ClientSize = new System.Drawing.Size(530, 430);
            this.Controls.Add(this.dgvDiem);
            this.Controls.Add(this.btnLamMoi);
            this.Controls.Add(this.btnXoa);
            this.Controls.Add(this.btnSua);
            this.Controls.Add(this.btnThem);
            this.Controls.Add(this.txtDiem);
            this.Controls.Add(this.lblDiem);
            this.Controls.Add(this.cboTenMH);
            this.Controls.Add(this.lblTenMH);
            this.Controls.Add(this.cboMaMH);
            this.Controls.Add(this.lblMaMH);
            this.Controls.Add(this.cboHoTen);
            this.Controls.Add(this.lblHoTen);
            this.Controls.Add(this.cboMaSo);
            this.Controls.Add(this.lblMaSo);
            this.Name = "frmNhapDiem";
            this.Text = "Nhập Điểm";
            this.Load += new System.EventHandler(this.frmNhapDiem_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvDiem)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private System.Windows.Forms.Label lblMaSo;
        private System.Windows.Forms.ComboBox cboMaSo;
        private System.Windows.Forms.Label lblHoTen;
        private System.Windows.Forms.ComboBox cboHoTen;
        private System.Windows.Forms.Label lblMaMH;
        private System.Windows.Forms.ComboBox cboMaMH;
        private System.Windows.Forms.Label lblTenMH;
        private System.Windows.Forms.ComboBox cboTenMH;
        private System.Windows.Forms.Label lblDiem;
        private System.Windows.Forms.TextBox txtDiem;
        private System.Windows.Forms.Button btnThem;
        private System.Windows.Forms.Button btnSua;
        private System.Windows.Forms.Button btnXoa;
        private System.Windows.Forms.Button btnLamMoi;
        private System.Windows.Forms.DataGridView dgvDiem;
    }
}
