namespace StudentManagement
{
    partial class frmXemDiem
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
            this.txtHoTen = new System.Windows.Forms.TextBox();
            this.lblKhoa = new System.Windows.Forms.Label();
            this.txtKhoa = new System.Windows.Forms.TextBox();
            this.btnXem = new System.Windows.Forms.Button();
            this.dgvXemDiem = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.dgvXemDiem)).BeginInit();
            this.SuspendLayout();
            
            this.lblMaSo.Location = new System.Drawing.Point(30, 30);
            this.lblMaSo.Text = "Mã số SV:";
            this.cboMaSo.Location = new System.Drawing.Point(100, 27);
            this.cboMaSo.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDown;
            this.cboMaSo.AutoCompleteMode = System.Windows.Forms.AutoCompleteMode.SuggestAppend;
            this.cboMaSo.AutoCompleteSource = System.Windows.Forms.AutoCompleteSource.ListItems;
            this.cboMaSo.SelectedIndexChanged += new System.EventHandler(this.cboMaSo_SelectedIndexChanged);
            this.cboMaSo.TextChanged += new System.EventHandler(this.cboMaSo_TextChanged);
            
            this.lblHoTen.Location = new System.Drawing.Point(30, 70);
            this.lblHoTen.Text = "Họ tên:";
            this.txtHoTen.Location = new System.Drawing.Point(100, 67);
            this.txtHoTen.ReadOnly = true;
            this.txtHoTen.Width = 145;
            
            this.lblKhoa.Location = new System.Drawing.Point(30, 110);
            this.lblKhoa.Text = "Khoa:";
            this.txtKhoa.Location = new System.Drawing.Point(100, 107);
            this.txtKhoa.ReadOnly = true;
            this.txtKhoa.Width = 145;
            
            this.btnXem.Location = new System.Drawing.Point(260, 25);
            this.btnXem.Text = "Xem Điểm";
            this.btnXem.Size = new System.Drawing.Size(100, 40);
            this.btnXem.Click += new System.EventHandler(this.btnXem_Click);
            
            this.dgvXemDiem.Location = new System.Drawing.Point(30, 150);
            this.dgvXemDiem.Size = new System.Drawing.Size(465, 200);
            this.dgvXemDiem.AllowUserToAddRows = false;
            this.dgvXemDiem.ReadOnly = true;
            
            this.ClientSize = new System.Drawing.Size(530, 380);
            this.Controls.Add(this.dgvXemDiem);
            this.Controls.Add(this.btnXem);
            this.Controls.Add(this.txtKhoa);
            this.Controls.Add(this.lblKhoa);
            this.Controls.Add(this.txtHoTen);
            this.Controls.Add(this.lblHoTen);
            this.Controls.Add(this.cboMaSo);
            this.Controls.Add(this.lblMaSo);
            this.Name = "frmXemDiem";
            this.Text = "Xem điểm";
            this.Load += new System.EventHandler(this.frmXemDiem_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvXemDiem)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private System.Windows.Forms.Label lblMaSo;
        private System.Windows.Forms.ComboBox cboMaSo;
        private System.Windows.Forms.Label lblHoTen;
        private System.Windows.Forms.TextBox txtHoTen;
        private System.Windows.Forms.Label lblKhoa;
        private System.Windows.Forms.TextBox txtKhoa;
        private System.Windows.Forms.Button btnXem;
        private System.Windows.Forms.DataGridView dgvXemDiem;
    }
}
