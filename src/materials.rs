use cgmath::prelude::*;
use cgmath::{vec3, Point3, Vector3};
use std::f32;

use crate::random;

pub fn reflected_vector(v: &Vector3<f32>, n: &Vector3<f32>) -> Vector3<f32> {
    v - n * 2.0 * v.dot(*n)
}

pub fn generate_reflect_probability(cosine: f32, refractive_index: f32) -> f32 {
    let mut r0 = (1.0 - refractive_index) / (1.0 + refractive_index);
    r0 = r0 * r0;
    r0 + ((1.0 - r0) * ((1.0 - cosine).powf(5.0)))
}

pub fn refracted_vector(
    v: &Vector3<f32>,
    n: &Vector3<f32>,
    ni_over_nt: f32,
) -> Option<Vector3<f32>> {
    let uv = v.normalize();
    let dt = uv.dot(*n);
    let discriminant = 1.0 - (ni_over_nt * ni_over_nt) * (1.0 - (dt * dt));
    if discriminant > 0.0 {
        let refracted = ni_over_nt * (uv - n * dt) - (n * (discriminant.sqrt()));
        Some(refracted)
    } else {
        None
    }
}

pub fn random_vec_in_unit_sphere() -> Vector3<f32> {
    let z = 1.0 - (2.0 * random());
    let r = (1.0 - (z * z)).sqrt();
    let theta = 2.0 * f32::consts::PI * random();
    let x = r * theta.cos();
    let y = r * theta.sin();

    random() * vec3(x, y, z)
}

#[derive(Clone)]
pub enum Texture {
    Constant {
        r: f32,
        g: f32,
        b: f32,
    },
    Checkerboard {
        left: Box<Texture>,
        right: Box<Texture>,
    },
}

impl Texture {
    pub fn value(&self, u: f32, v: f32, point: &Point3<f32>) -> Point3<f32> {
        match self {
            Texture::Constant { r, g, b } => Point3::new(*r, *g, *b),
            Texture::Checkerboard { left, right } => {
                let sines =
                    f32::sin(10.0 * point.x) * f32::sin(10.0 * point.y) * f32::sin(10.0 * point.z);

                if sines < 0.0 {
                    left.value(u, v, point)
                } else {
                    right.value(u, v, point)
                }
            }
        }
    }
}

#[derive(Clone)]
pub enum Material {
    Lambertian { texture: Texture },
    Metallic { r: f32, g: f32, b: f32 },
    Dielectric { refractive_index: f32 },
}
