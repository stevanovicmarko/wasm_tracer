#![feature(use_extern_macros)]
#![allow(dead_code)]

#[macro_use]
extern crate cascade;

extern crate cgmath;
extern crate wasm_bindgen;

use cgmath::prelude::*;
use cgmath::{vec3, Point3, Vector3};
use std::{f32, mem, u16, usize};
use wasm_bindgen::prelude::*;

mod ray;
use ray::Ray;

mod camera;
use camera::Camera;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = Math, js_name = random)]
    pub fn random() -> f32;

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log(s: &str);

    type Crypto;
    static crypto: Crypto;

    #[wasm_bindgen(method, js_name = getRandomValues)]
    fn get_random_values(this: &Crypto, values: Vec<u16>) -> Vec<u16>;
}

fn make_random_array(len: usize) -> Vec<f32> {
    // let xs = 0..len;

    // let ys = xs.map(|_x| 2.0 - random() - 1.0).collect::<Vec<f32>>();
    // ys
    let max_val = f32::from(u16::MAX);

    crypto
        .get_random_values(vec![0_u16; len])
        .into_iter()
        .map(|x| (f32::from(x)) / max_val)
        .collect::<Vec<f32>>()
}

fn random_vec_in_unit_sphere() -> Vector3<f32> {
    let z = 1.0 - (2.0 * random());
    let r = (1.0 - (z * z)).sqrt();
    let theta = 2.0 * f32::consts::PI * random();
    let x = r * theta.cos();
    let y = r * theta.sin();

    random() * vec3(x, y, z)
}

fn reflect(v: &Vector3<f32>, n: &Vector3<f32>) -> Vector3<f32> {
    v - n * 2.0 * v.dot(*n)
}

fn schlick(cosine: f32, ref_idx: f32) -> f32 {
    let mut r0 = (1.0 - ref_idx) / (1.0 + ref_idx);
    r0 = r0 * r0;
    r0 + (1.0 - r0) * ((1.0 - cosine).powf(5.0))
}

#[derive(Clone, Copy)]
enum Material {
    Lambertian { r: f32, g: f32, b: f32 },
    Metalic { r: f32, g: f32, b: f32 },
    Dielectric { ri: f32 },
}

#[derive(Clone, Copy)]
pub struct ShadeRecord {
    normal: Vector3<f32>,
    local_hit_point: Point3<f32>,
    material: Material,
    t: f32,
}

impl ShadeRecord {
    fn new(normal: Vector3<f32>, local_hit_point: Point3<f32>, material: Material, t: f32) -> Self {
        ShadeRecord {
            normal,
            local_hit_point,
            material,
            t,
        }
    }
}

trait GeometricObject {
    fn hit(&self, ray: &Ray, t_min: f32, t_max: f32) -> Option<ShadeRecord>;
}

struct Sphere {
    center: Point3<f32>,
    radius: f32,
    material: Material,
}

impl Sphere {
    fn new(center: Point3<f32>, radius: f32, material: Material) -> Self {
        Sphere {
            center,
            radius,
            material,
        }
    }
}

impl GeometricObject for Sphere {
    fn hit(&self, ray: &Ray, t_min: f32, t_max: f32) -> Option<ShadeRecord> {
        let oc: Vector3<f32> = ray.origin - self.center;
        let a = ray.direction.magnitude2();
        let b = oc.dot(ray.direction);
        let c = oc.magnitude2() - self.radius * self.radius;
        let discriminant = b * b - a * c;

        let (near, far) = (
            (-b - discriminant.sqrt()) / a,
            (-b + discriminant.sqrt()) / a,
        );

        let maybe_new_t: Option<f32> = match (
            discriminant < 0.0,
            near > t_min && near < t_max,
            far > t_min && far < t_max,
        ) {
            (true, _, _) => None,
            (_, true, _) => Some(near),
            (_, _, true) => Some(far),
            _ => None,
        };

        if let Some(t) = maybe_new_t {
            let local_hit_point = ray.point_at_parameter(t);
            Some(ShadeRecord {
                t,
                local_hit_point,
                normal: (local_hit_point - self.center) / self.radius,
                material: self.material,
            })
        } else {
            None
        }
    }
}

struct World {
    t_min: f32,
    t_max: f32,
    objects: Vec<Box<GeometricObject>>,
}

impl World {
    fn new() -> Self {
        World {
            objects: Vec::new(),
            t_min: 0.001,
            t_max: 1000.0,
        }
    }

    fn add_object(&mut self, object: Box<GeometricObject>) {
        self.objects.push(object);
    }

    fn trace(&self, ray: &Ray) -> Option<ShadeRecord> {
        let mut sr: Option<ShadeRecord> = None;
        let mut closest_so_far = self.t_max;
        for object in &self.objects {
            if let Some(rec) = object.hit(ray, self.t_min, closest_so_far) {
                //                self.t_max = rec.t;
                closest_so_far = rec.t;
                sr = Some(rec);
            }
        }
        sr
    }
}

fn color(ray: &Ray, world: &World, depth: usize) -> Vector3<f32> {
    let rec = world.trace(ray);

    let final_color: Vector3<f32> = match (rec, depth < 50) {
        (Some(ref rec), true) => {
            let c: Vector3<f32> = match rec.material {
                Material::Lambertian { r, g, b } => {
                    let target = rec.local_hit_point + rec.normal + random_vec_in_unit_sphere();
                    let bounced_ray = Ray::new(rec.local_hit_point, target - rec.local_hit_point);
                    let v = color(&bounced_ray, world, depth + 1);
                    vec3(v.x * r, v.y * g, v.z * b)
                }
                Material::Metalic { r, g, b } => {
                    let reflected = reflect(&ray.direction.normalize(), &rec.normal);
                    let scattered = Ray::new(
                        rec.local_hit_point,
                        reflected + 0.5 * random_vec_in_unit_sphere(),
                    );

                    let v = if scattered.direction.dot(rec.normal) > 0.0 {
                        let u = color(&scattered, world, depth + 1);
                        vec3(u.x * r, u.y * g, u.z * b)
                    } else {
                        color(&scattered, world, depth + 1)
                    };
                    v
                }
                Material::Dielectric { ri } => {
                    // TODO: Implement Dielectric
                    vec3(ri, ri, ri)
                }
            };
            c
        }
        (Some(_), false) => vec3(0.0, 0.0, 0.0),
        (None, _) => {
            let unit_direction = ray.direction.normalize();
            let t = (unit_direction.y + 1.0) * 0.5;
            vec3(1.0, 1.0, 1.0).lerp(vec3(0.5, 0.7, 1.0), t)
        }
    };
    final_color
}

#[wasm_bindgen]
pub fn make_image(canvas_width: u16, canvas_height: u16, num_samples: u8) -> Vec<u32> {
    let size = usize::from(canvas_width) * usize::from(canvas_height);

    let samples_divider = f32::from(num_samples);

    let mut image = Vec::with_capacity(size);
    let world = cascade! {
        World::new();
        ..add_object(Box::new(Sphere::new(
        Point3::new(0.0, -1000.5, -1.0),
        1000.0,
        Material::Lambertian {
            r: 0.2,
            g: 0.8,
            b: 0.3,
        },
        )));
        ..add_object(Box::new(Sphere::new(
        Point3::new(0.0, 0.1, -1.0),
        0.6,
        Material::Lambertian {
            r: 0.99,
            g: 0.1,
            b: 0.01,
        },
    )));
    ..add_object(Box::new(Sphere::new(
        Point3::new(1.1, 0.0, -1.0),
        0.5,
        Material::Lambertian {
            r: 0.25,
            g: 0.45,
            b: 0.8,
        },
    )));
    ..add_object(Box::new(Sphere::new(
        Point3::new(-0.95, 0.5, -1.0),
        0.45,
        Material::Metalic {
            r: 0.8,
            g: 0.8,
            b: 0.8,
        },
    )));
    ..add_object(Box::new(Sphere::new(
        Point3::new(-1.2, -0.2, -1.0),
        0.3,
        Material::Lambertian {
            r: 0.9,
            g: 0.9,
            b: 0.2,
        },
    )));
    };

    let look_from = Point3::new(0.0, 0.9, 5.0);
    let look_at = Point3::new(0.0, 0.0, -1.0);
    let v_up = vec3(0.0, 1.0, 0.0);
    let dist_to_focus = (look_from - look_at).magnitude();
    let aperture = 0.4;

    let camera = Camera::new(
        look_from,
        look_at,
        v_up,
        20.0,
        f32::from(canvas_width) / f32::from(canvas_height),
        aperture,
        dist_to_focus,
    );

    let mut pixel_color = vec3(0.0, 0.0, 0.0);

    for i in 0..canvas_height {
        for j in 0..canvas_width {
            pixel_color.x = 0.0;
            pixel_color.y = 0.0;
            pixel_color.z = 0.0;
            for _s in 0..num_samples {
                let dx = (f32::from(j) + 1.0 - (2.0 * random())) / f32::from(canvas_width);
                let dy = (f32::from(i) + 1.0 - (2.0 * random())) / f32::from(canvas_height);

                let direction = camera.get_ray(dx, dy);
                pixel_color += color(&direction, &world, 0);
            }
            pixel_color /= samples_divider;

            let (r, g, b) = pixel_color.into();

            let pixel = unsafe {
                mem::transmute::<[u8; 4], u32>([
                    (r.sqrt() * 255.99) as u8,
                    (g.sqrt() * 255.99) as u8,
                    (b.sqrt() * 255.99) as u8,
                    255,
                ])
            };
            image.push(pixel);
        }
    }
    image
}

#[wasm_bindgen]
pub fn greet(_name: &str) {
    // let v = Vector3::new(1.0, 2.0, 3.0);
    // let xz = v.xz();

    // let b = random();
    // let _r = format!("{}", b);

    // let _s = format!("{:?}", xz);

    // let x = vec![0_i16; 5];
    // let y = crypto.get_random_values(x);
    // let z = format!("{:?}", y);

    // alert(&z);
    // alert(&format!("Hello, {} {} {}!", name, s, &r));

    //     let rs = format!("{:?}", make_random_array(4));
    //     log(&rs);
    //
    //    let v = random_vec_in_unit_sphere();
    //    let rs = format!("{:?}, {:?}", v, Vector3::<f32>::dot(v, v));
    //    log(&rs);
}
