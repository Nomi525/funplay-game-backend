import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Permission', timestamps: true })
export class Permission extends Document {
  @Prop({ required: false })
  Role_type: string;

  @Prop({ default: false })
  Status: boolean;

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  UserManagement: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  Transaction: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  WithdrawlRequest: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  BannerManagement: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  CurrencyManagement: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  GameManagement: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  WinnerDeclaration: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  Periods: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  Query: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  Setting: {
    all: boolean;
    create: boolean;
    update: boolean;
    View: boolean;
    delete: boolean;
  };

  @Prop({
    type: {
      all: Boolean,
      create: Boolean,
      update: Boolean,
      View: Boolean,
      delete: Boolean,
    },
    required: false,
    default: {
      all: false,
      create: false,
      update: false,
      View: false,
      delete: false,
    },
  })
  CMS: {
    TermsAndCondition: {
      all: boolean;
      create: boolean;
      update: boolean;
      View: boolean;
      delete: boolean;
    };
    PrivacyPolicy: {
      all: boolean;
      create: boolean;
      update: boolean;
      View: boolean;
      delete: boolean;
    };
  };

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

const PermissionSchema = SchemaFactory.createForClass(Permission);
export default PermissionSchema;
