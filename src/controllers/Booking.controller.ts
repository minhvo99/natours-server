import { deleteOne, updateOne, createOne, getOne, getAll } from './HandleFactory';
import Booking from 'src/model/Booking.model';
// import { catchAsync } from 'src/utils/catchAsync';
// import { NextFunction, Request, Response } from 'express';
// import Tour from 'src/model/Tour.model';
// import User from 'src/model/User.model';
// import Stripe from 'stripe';
// import { ITour } from 'src/constans/Tour';
// import { IUser } from 'src/constans/User';

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// export const getCheckoutSession = catchAsync(async (req, res, next) => {
//    // 1) Get the currently booked tour
//    const tour = (await Tour.findById(req.params.tourId)) as ITour;
//    // console.log(tour);

//    // 2) Create checkout session
//    const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],

//       // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
//       //   req.params.tourId
//       // }&user=${req.user.id}&price=${tour.price}`,

//       success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,

//       cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour?.slug}`,

//       customer_email: (req as any).user.email,

//       client_reference_id: req.params.tourId,

//       line_items: [
//          {
//             name: `${tour?.name} Tour`,
//             description: tour?.summary,
//             images: [`${req.protocol}://${req.get('host')}/img/tours/${tour?.imageCover}`],
//             amount: tour?.price * 100,
//             currency: 'usd',
//             quantity: 1,
//          },
//       ],
//    });

//    // 3) Create session as response
//    res.status(200).json({
//       status: 'success',
//       session,
//    });
// });

// const createBookingCheckout = async (session: any) => {
//    const tour = session.client_reference_id;
//    const user = ((await User.findOne({ email: session.customer_email })) as IUser).id;
//    const price = session.display_items[0].amount / 100;
//    await Booking.create({ tour, user, price });
// };

// export const webhookCheckout = (req: Request, res: Response, next: NextFunction) => {
//    const signature = req.headers['stripe-signature'];

//    let event;
//    try {
//       event = stripe.webhooks.constructEvent(
//          req.body,
//          signature,
//          process.env.STRIPE_WEBHOOK_SECRET,
//       );
//    } catch (err: unknown) {
//       return res.status(400).send(`Webhook error: ${(err as any).message}`);
//    }

//    if (event.type === 'checkout.session.completed') createBookingCheckout(event.data.object);

//    res.status(200).json({ received: true });
// };

export const createBooking = createOne(Booking, 'Booking');
export const getBooking = getOne(Booking, 'Booking', '');
export const getAllBookings = getAll(Booking, 'Booking');
export const updateBooking = updateOne(Booking, 'Booking');
export const deleteBooking = deleteOne(Booking, 'Booking');
