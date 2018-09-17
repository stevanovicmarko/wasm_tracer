extern crate cgmath;

use cgmath::{Point3, Vector3};

use materials::Material;

#[derive(Clone, Copy)]
pub struct ShadeRecord {
    pub normal: Vector3<f32>,
    pub local_hit_point: Point3<f32>,
    pub material: Material,
    pub intersect_parameter: f32,
}

impl ShadeRecord {
    fn new(
        normal: Vector3<f32>,
        local_hit_point: Point3<f32>,
        material: Material,
        intersect_parameter: f32,
    ) -> Self {
        ShadeRecord {
            normal,
            local_hit_point,
            material,
            intersect_parameter,
        }
    }
}
