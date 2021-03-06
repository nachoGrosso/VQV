<?php

class Reciclaje extends Admin_Controller {

    function __construct() {
        parent::__construct();
    }

    function index() {
        $this->data['reciclajes'] = $this->reciclaje_m->get();
        $this->data['subview'] = 'admin/reciclaje/index';   
        $this->load->view('admin/_layout_main', $this->data);
    }

    function edit($id = NULL) {
        if ($id) {
            $this->data['reciclaje'] = $this->reciclaje_m->get(['id'=>$id],TRUE);
            count($this->data['reciclaje']) || $this->data['errores'][] = 'Reciclaje no encontrada';
            if ($this->data['reciclaje']->imagen <> '') {
                $script = '<script type="text/javascript">$("#file").fileinput({
                                            uploadAsinc: false,
                                            showUpload: false,
                                            showRemove: false,
                                            overwriteInitial: false,
                                            overwrite:false,
                                            initialPreview: [';

                $script .= "'<img src=" . '"' . site_url($this->imageDir . $this->data['reciclaje']->imagen) . '" class="file-preview-image">' . "',";
                $script .= '], initialPreviewConfig: [';
                $script .= '{height:"120px", url:"' . site_url('admin/reciclaje/delete_imagen') . '/' . $this->data['reciclaje']->id . '"},';
                $script .= ']})</script>;';

                $this->data['scripts'][] = $script;               
            } 
            $where = ['id'=>$id];
        } else {
            $this->data['reciclaje'] = $this->reciclaje_m->new_reciclaje();
            $where = NULL;                 
        }
        $rules = $this->reciclaje_m->rules;
        $this->form_validation->set_rules($rules);
        if ($this->form_validation->run() == TRUE) {
            //Levanta campos del form
            $data = $this->reciclaje_m->array_from_post(array('titulo', 'subtitulo', 'texto'));

            if (!empty($_FILES['file']) && $_FILES['file']['name'] <> '') {
                if ($this->data['reciclaje']->imagen <> '') {
                    unlink($this->imageDir . $this->data['reciclaje']->imagen);
                    $data['imagen'] = '';
                }
                $ext = explode('.', basename($_FILES['file']['name']));
                $name = md5(uniqid()) . "." . array_pop($ext);
                $target = $this->imageDir . $name;
                if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
                    $data['imagen'] = $name;
                }
            }
            // Guardo datos en BD
            $this->reciclaje_m->save($data, $where);
            // Redirijo al grid de paginas
            redirect('admin/reciclaje');
        }
        $this->data['subview'] = 'admin/reciclaje/edit';
        $this->load->view('admin/_layout_main', $this->data);
    }

    function delete($id) {
        //deslink imagen
        $rec = $this->reciclaje_m->get(['id'=>$id], TRUE);
        if ($rec->imagen <> '') {
            unlink($this->imageDir . $rec->imagen);
        }
        $this->reciclaje_m->delete(['id'=>$id]);
        redirect('admin/reciclaje');
    }

    function delete_imagen($id) {
        $rec = $this->reciclaje_m->get(['id'=>$id],TRUE);
        if ($rec->imagen <> '') {
            unlink($this->imageDir . $rec->imagen);
            $data['imagen'] = '';
            $this->reciclaje_m->save($data, ['id'=>$id]);
            echo 0;
        }
    }

    function buscar() {
        //sacr el filtro del request

        $catdes = $this->input->get('catdescripcion');
        // pedir todos los producto con el filtro
        $this->db->where('catdescripcion like', '%' . $catdes . '%');
        $reciclajes = $this->reciclaje_m->get();

        if (count($reciclajes)): foreach ($reciclajes as $reciclaje):
                echo '<tr>';
                echo '<td>' . $reciclaje->catid . '</td>';
                echo '<td>' . anchor('admin/reciclaje/edit/' . $reciclaje->catid, $reciclaje->catdescripcion) . '</td>';
                echo '<td>' . btn_edit('admin/reciclaje/edit/' . $reciclaje->catid) . '</td>';
                echo '<td>' . btn_delete('admin/reciclaje/delete/' . $reciclaje->catid) . '</td>';
                echo '</tr>';
            endforeach;
        else:
            echo '<tr>';
            echo '<td colspan=4>No se encontraron reciclajes para estos filtros</td>';
            echo '</tr>';
        endif;
    }

}
